import { createModelSchema, list, object, optional } from 'serializr';
import { ConnectorPort, FlowConnectorInPort, FlowConnectorOutPort, DataConnectorInPort, DataConnectorOutPort, ReactionConnectorInPort, ReactionConnectorOutPort } from '../ConnectorPort';
import { EdgeSchema } from './EdgeSchema';

export const ConnectorSchema = createModelSchema(ConnectorPort, {
    _name: optional(true),
    id: true,
    direction: true,
    type: true,
    connections: list(object(EdgeSchema)),
    associated: true
}, (context) => {
    const { json } = context;
    switch (json.type) {
        case "flow": if (json.direction === "in")
            return new FlowConnectorInPort();
            else return new FlowConnectorOutPort();
        case "data": if (json.direction === "in")
            return new DataConnectorInPort("data-in", () => "");
            else return new DataConnectorOutPort("data-out", () => ({
                cache: undefined,
                cached: false
            }));
        case "reaction": if (json.direction === "in")
            return new ReactionConnectorInPort("name", () => undefined);
            else return new ReactionConnectorOutPort("reaction-out");
    }
    return new ConnectorPort("flow", "in");
});
