export default class WebSocketClient {
  private connection: WebSocket | undefined;
  private authToken: string | undefined;
  private subscriptions: { event: string; data: any }[] = [];
  private onEventHandlers: { event: string; fn: any }[] = [];

  constructor(
    protected endpoint: string,
    protected onEvents: {
      onConnect: () => void;
      onDisconnect: () => void;
      onError: () => void;
    }
  ) {}

  public addOnEvent = async (event: string, fn: any) => {
    this.onEventHandlers = [...this.onEventHandlers, { event, fn }];
  };

  public subscribe = async (event: string, data?: any) => {
    const subscribeEvent = this.getSubscribeEvent(event);
    this.subscriptions = [
      ...this.subscriptions,
      { event: subscribeEvent, data },
    ];
    await this.send(subscribeEvent, data);
  };

  public unsubscribe = async (event: string, data?: any) => {
    const subscribeEvent = this.getSubscribeEvent(event);
    const unsubscribeEvent = this.getUnsubscribeEvent(event);

    this.subscriptions = this.subscriptions.filter(
      (s) =>
        !(
          s.event === subscribeEvent &&
          JSON.stringify(s.data) === JSON.stringify(data)
        )
    );

    await this.send(unsubscribeEvent, data);
  };

  public send = async (event: string, data?: any) => {
    const connection = await this.getConnection();
    console.log(`Socket Client - Sending "${event}"`);
    connection.send(
      JSON.stringify({
        event,
        token: this.authToken,
        data,
      })
    );
  };

  public disconnect = () => {
    if (this.connection) {
      this.connection.close();
      this.connection = undefined;
    }
  };

  public reconnect = () => {
    this.subscriptions.forEach((s) => this.send(s.event, s.data));
  };

  public clearAuthorization = (): void => {
    this.authToken = undefined;
  };

  public setAuthorization = (authToken: string): void => {
    this.authToken = authToken;
  };

  public connect = async (): Promise<WebSocket> => {
    const connection = await new Promise<WebSocket>((resolve) => {
      const ws = new WebSocket(this.endpoint);
      ws.onopen = () => {
        console.log(`Socket Client - Connected`);
        this.onEvents.onConnect();
        resolve(ws);
      };
      ws.onclose = () => {
        console.log("Socket Client - Disconnected");
        this.onEvents.onDisconnect();
      };
      ws.onerror = (err) => {
        console.log("Socket Client - Error", err);
        this.onEvents.onError();
      };
    });

    this.connection = connection;
    this.connection.onmessage = this.onMessage;
    return connection;
  };

  private getConnection = async () => {
    if (this.connection) {
      return this.connection;
    } else {
      return this.connect();
    }
  };

  private onMessage = (message: { data?: string }) => {
    try {
      if (!message.data) {
        return console.log("Socket Client - Message received but data missing");
      }

      const data = JSON.parse(message.data) as { event?: string; body?: any };

      if (!data.event) {
        return console.log(
          "Socket Client - Message received but with no message.data.event"
        );
      }

      console.log(`Socket Client - Message received - Event: ${data.event}`);

      const handler = this.onEventHandlers.find((h) => h.event === data.event);

      if (handler) {
        handler.fn(data.body);
      }
    } catch (error) {
      console.log(error);
    }
  };

  private getSubscribeEvent = (event: string) => {
    return `SUBSCRIBE_${event}`;
  };

  private getUnsubscribeEvent = (event: string) => {
    return `UNSUBSCRIBE_${event}`;
  };
}
