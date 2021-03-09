import { Server as WebSocketServer, OPEN } from "ws";

export default class SocketService implements api.ISocketService {
  constructor(private ws: WebSocketServer) {}

  public broadcastMakerEvent = async (event: api.MakerSocketEvent) =>
    this.broadcast("MAKER_EVENT", event);

  private broadcast = async (event: string, body: any) => {
    this.ws.clients.forEach(function each(client) {
      if (client.readyState === OPEN) {
        console.log(`Socket Client - Sending "${event}"`);
        client.send(
          JSON.stringify({
            event,
            body,
          })
        );
      }
    });
  };
}
