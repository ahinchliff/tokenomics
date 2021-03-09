declare namespace api {
  interface ISocketService {
    broadcastMakerEvent(event: api.MakerSocketEvent): Promise<void>;
  }
}
