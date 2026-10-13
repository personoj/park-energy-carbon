export interface AgentToolContext {
  /** Injected by the server from authenticated identity, never trusted from model output. */
  actorId: string;
  parkId: string;
  traceId: string;
}
