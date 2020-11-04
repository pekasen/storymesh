/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject"
import { IEdge } from "./IEdge"
import { IGraph } from "./IGraph"
import { INodePredicate } from "./INodePredicate"
import { IEdgePredicate } from "./IEdgePredicate"
import { IContent } from "./IContent"
import { IMetaData } from "./IMetaData"

/**
 * @author Philipp Kessling
 */
export class StoryGraph implements IGraph {

    /**
     * 
     */
    public constructor(nodes?: IStoryObject[], edges?: IEdge[]) {
        this.nodes = nodes || [];
        this.edges = edges || [];
    }

    /**
     * 
     */
    nodes: IStoryObject[];
    /**
     * 
     */
    edges: IEdge[];
    /**
     * @param node 
     * @return
     */
     public addNode(node: IStoryObject) :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @param connections 
     * @return
     */
    public connect(connections: IEdge[]) :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @param edge 
     * @return
     */
    public disconnect(edge: IEdge[]) :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * 
     */
    public static makeContentObject() :  void {
        // TODO implement here
    }

    /**
     * @param nodes 
     * @param edges 
     * @return
     */
    public static makeGraph(nodes: IStoryObject[], edges: IEdge[]) :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @return
     */
    public static makeStoryObject() :  IStoryObject {
        // TODO implement here
        return this.makeStoryObject();
    }
    
    /**
     * @param graph 
     * @return
     */
    public merge(graph: IGraph) :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @param node 
     * @return
     */
    public removeNode(node: IStoryObject) :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @return
     */
    public flatten() :  StoryGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * Traverses the given graph and its subgraph and returns all nodes which match the query.
     * @param predicate Object with parameters to match the graph's nodes against.
     * @return Array of nodes.
     */
    public getNodes(predicate: INodePredicate) :  IStoryObject[] {
        // TODO implement here
        return [];
    }

    /**
     * Traverses the given graph and its subgraphs and returns all matching edges.
     * @param predicate 
     * @return
     */
    public getEdges(predicate: IEdgePredicate) :  IEdge[] {
        // TODO implement here
        return [];
    }

    /**
     * 
     */
    public getEdgeType() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    public getEdgeConditions() :  void {
        // TODO implement here
    }

    /**
     * @param edge 
     * @param parameters 
     * @return
     */
    public setEdgeParameters(edge: IEdge, parameters: any) :  IGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @param edge 
     * @return
     */
    public setEdgeType(edge: IEdge) :  IGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @param node 
     * @param parameters 
     * @return
     */
    public setNodeParameters(node: IStoryObject, parameters: any) :  IGraph {
        // TODO implement here
        return new StoryGraph();
    }

    /**
     * @return
     */
    public toJSON() :  string {
        // TODO implement here
        return "";
    }

    /**
     * @param graph 
     * @return
     */
    public fromJSON(graph: IGraph) :  string {
        // TODO implement here
        return "";
    }

    /**
     * @param content? 
     * @param network? 
     * @param metaData? 
     * @return
     */
    private static _templateStoryObject(content?: IContent, network?: IGraph, metaData?: IMetaData) : IStoryObject {
        return {
                content: content || undefined,
                userDefinedProperties: {},
                metaData: metaData || {
                    name: "",
                    createdAt: new Date(),
                    tags: []
                },
                outgoing: [],
                incoming: [],
                parent: undefined,
                network: network || {
                    nodes: [],
                    edges: []
                },
                renderingProperties: {
                    width: .33,
                    order: 0,
                    collapsable: true
                },
                isContentNode: (content ? true : false),
                modifiers: []
            }
        }

}