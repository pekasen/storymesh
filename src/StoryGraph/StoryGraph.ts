/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject"
import { IEdge } from "./IEdge"
import { IRegistry } from "./IRegistry"

/**
 * A graph to connect story content
 * 
 * @author Philipp Kessling
 */
export class StoryGraph {

    /**
     * 
     */
    public constructor(parent: IStoryObject, nodes?: IStoryObject[], edges?: IEdge[]) {
        this.parent = parent;
        this.nodes = nodes || [];
        this.edges = edges || [];
    }
    
    /**
     * 
     */
    nodes: (IStoryObject)[];

    /**
     * 
     */
    edges: IEdge[];

    /**
     * 
     * 
     */
    parent: IStoryObject;

    /**
     * @param node 
     * @return
     */
     public addNode(registry: IRegistry, node: IStoryObject) :  void {
        if (!this._nodeExists(node.id)) {
            this.nodes.push(node);
            node.parent = this.parent.id;
            registry.register(node);
        } else throw("node exists already")
    }

    /**
     * @param nodes 
     * @param edges 
     * @return
     */
    public static makeGraph(parent: IStoryObject, nodes: IStoryObject[], edges: IEdge[]) :  StoryGraph {
        return new StoryGraph(parent, nodes, edges);
    }

    /**
     * @param connections 
     * @return
     */
    public connect(registry: IRegistry, connections: IEdge[]) :  void {
        const validEdges = this._areEdgesValid(registry, connections);
        
        // push to our local edges;
        this.edges.push(...validEdges);

        // update refs on the referenced edges
        validEdges.forEach(edge => {
            this._updateReference(
                registry, this.parent.id, edge
            )
        });
    }

    /**
     * @param edge 
     * @return
     */
    public disconnect(registry: IRegistry, edges: IEdge[]) :  void {
        const validEdges = this._areEdgesValid(registry, edges);

        validEdges.forEach(edge => {
            this.edges.splice(
                this.edges.indexOf(edge), 1
            );
            const cons = registry.getValue(edge.to)?.connections
            if ( cons ) cons.splice(
                cons.indexOf(edge), 1
            )
        });
    }

    /**
     * @param node 
     * @return
     */
    public removeNode(registry: IRegistry, node: IStoryObject) :  void {
        if (this._nodeExists(node.id)) {

            const edges = this.edges.filter(edge => (edge.to === node.id || edge.from === node.id))
            if (edges.length >= 1) {
                this.disconnect(registry, edges);
            }

            const index = this.nodes.indexOf(node);
            this.nodes.splice(index, 1)

            registry.deregister(node.id);
        }
    }

    /**
     * This method is called before deleting and must be used to clean up lost children
     * 
     * @param {IRegistry} registry object to deregister from
     */
    public willDeregister(registry: IRegistry) {
        this._nodeIDs.forEach(id => registry.deregister(id));
    }

    public traverse(registry: IRegistry, fromNode: string): IStoryObject[] {
        const recurse = (node: IStoryObject): IStoryObject[] => {
            const _res = [node];
            
            const out = node
            .connections
            .filter(e => e.from === this.parent.id)
            .map(e => registry.getValue(e.to))
            .filter(e => e !== undefined) as IStoryObject[];

            _res.push(
                ...out
                .map(n => recurse(n))
                .reduce((n, m) => {
                    n.push(...m);
                    return n
                })
            );

            return _res
        }
        const _node = registry.getValue(fromNode);
        if (_node) return recurse(_node)
        else return []
    }

    private _areEdgesValid(registry: IRegistry, edges: IEdge[]) {
  
        return edges.filter((edge) => {
            // validate wether both ends of the edge exists in this graph and they have the specified port
            return (
                this._nodeExists(edge.from) &&
                this._nodeExists(edge.to) &&
                this._hasConnectorPort(registry, edge.from) &&
                this._hasConnectorPort(registry, edge.to)
            )
        })
    }

    private _hasConnectorPort(registry: IRegistry, id: string): boolean {
        const [_id, _port] = this.parseNodeId(id);
        const item = registry.getValue(_id);
        if (item) return item?.connectors.findIndex(con => (
            con.name === _port
        )) !== -1
        else return false
    }

    public parseNodeId(id: string): string[] {
        return this._parseNodeId(id)
    }

    private _parseNodeId(id: string): string[] {
        return id.split(".")
    }

    private _updateReference(registry: IRegistry, parent: string, edge: IEdge): void {
        const [fromId] = this._parseNodeId(edge.from);
        const [toId] = this._parseNodeId(edge.to);
        
        const _end1 = registry.getValue(fromId);
        const _end2 = registry.getValue(toId);
        
        if (_end1 && _end2) {
            _end1.parent = parent;
            _end2.parent = parent;
    
            _end1.connections.push(edge);
            _end2.connections.push(edge);
        }
    }

    private _nodeExists(id: string): boolean {
        const [_id] = this.parseNodeId(id);
        const ids = this._nodeIDs;
        return ids.indexOf(_id) !== -1
    }

    private get _nodeIDs () {
        return this.nodes.map(node => node.id)
    }
}


    // /**
    //  * @param graph 
    //  * @return
    //  */
    // public merge(graph: IGraph) :  StoryGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @return
    //  */
    // public flatten() :  StoryGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * Traverses the given graph and its subgraph and returns all nodes which match the query.
    //  * @param predicate Object with parameters to match the graph's nodes against.
    //  * @return Array of nodes.
    //  */
    // public getNodes(predicate: INodePredicate) :  IStoryObject[] {
    //     // TODO implement here
    //     return [];
    // }

    // /**
    //  * Traverses the given graph and its subgraphs and returns all matching edges.
    //  * @param predicate 
    //  * @return
    //  */
    // public getEdges(predicate: IEdgePredicate) :  IEdge[] {
    //     // TODO implement here
    //     return [];
    // }

    // /**
    //  * 
    //  */
    // public getEdgeType() :  void {
    //     // TODO implement here
    // }

    // /**
    //  * 
    //  */
    // public getEdgeConditions() :  void {
    //     // TODO implement here
    // }

    // /**
    //  * @param edge 
    //  * @param parameters 
    //  * @return
    //  */
    // public setEdgeParameters(edge: IEdge, parameters: any) :  IGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @param edge 
    //  * @return
    //  */
    // public setEdgeType(edge: IEdge) :  IGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @param node 
    //  * @param parameters 
    //  * @return
    //  */
    // public setNodeParameters(node: IStoryObject, parameters: any) :  IGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @return
    //  */
    // public toJSON() :  string {
    //     // TODO implement here
    //     return "";
    // }

    // /**
    //  * @param graph 
    //  * @return
    //  */
    // public fromJSON(graph: IGraph) :  string {
    //     // TODO implement here
    //     return "";
    // }

    // /**
    //  * @param content? 
    //  * @param network? 
    //  * @param metaData? 
    //  * @return
    //  */
    // private static _templateStoryObject(content?: IContent, network?: IGraph, metaData?: IMetaData) : IStoryObject {
    //     return {
    //             content: content || undefined,
    //             userDefinedProperties: {},
    //             metaData: metaData || {
    //                 name: "",
    //                 createdAt: new Date(),
    //                 tags: []
    //             },
    //             outgoing: [],
    //             incoming: [],
    //             parent: undefined,
    //             network: network || {
    //                 nodes: [],
    //                 edges: []
    //             },
    //             renderingProperties: {
    //                 width: .33,
    //                 order: 0,
    //                 collapsable: true
    //             },
    //             isContentNode: (content ? true : false),
    //             modifiers: []
    //         }
    // }
