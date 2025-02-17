import {AfterViewInit, Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-twitch-stream',
  templateUrl: './twitch-stream.component.html',
  styleUrls: ['./twitch-stream.component.scss']
})
export class TwitchStreamComponent implements AfterViewInit {

  socket!: WebSocket;
  //stompClient!: Client;
  //sessionId!: string;
  //socketClient!: Stomp.Client;

  online = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.connectToWebSocket();

  }

  connectToWebSocket() {
    this.socket = new WebSocket('/wsa/twitch-status');

    this.socket.onmessage = (event) => {
      if (event.data === 'h') {
        return;
      }
      const data: any[] = JSON.parse(event.data);
      data.forEach(stream => {
        if (stream.channel === "Galajus") {
          this.online = stream.live;
        }
      })

    };

    this.socket.onclose = (e) => {
      setTimeout(() => this.connectToWebSocket(), 5000);
    };

    this.socket.onerror = (error) => {

    };
  }

  redirectToStream() {
    window.open('https://www.twitch.tv/galajus', '_blank');
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    /*if (this.stompClient) {
      this.stompClient.deactivate();
    }

    if (this.socketClient) {
      if (this.socketClient.connected) {
        this.socketClient.disconnect(() => {});
      }
    }*/

  }

  /*connectToWebSocketV3() {
    const ws = new SockJS('/wsa/twitch-status');
    this.socketClient = Stomp.over(ws);

    this.socketClient.debug = () => {};

    this.socketClient.heartbeat.outgoing = 20000; // Wysyłanie co 20 sek.
    this.socketClient.heartbeat.incoming = 20000;
    this.socketClient.connect({}, () => {
      this.subscribeStatusesV3();
    })
  }

  subscribeStatusesV3() {
    this.socketClient.subscribe('/topic/twitch-status', message => {
      if (message.body) {
        const data = JSON.parse(message.body);
        //console.log('Twitch status update: ', data);
        this.online = data.live;
      }

    });

    this.socketClient.subscribe('/user/queue/status', message => {
      if (message.body) {
        let data = JSON.parse(message.body);
        //console.log('XOtrzymane statusyX:', data);
        this.online = data.live;
      }

    });
    this.socketClient.send('/app/status');
    this.socketClient.send('/topic/twitch-status');
  }

  connectToWebSocketV2() {
    this.stompClient = new Client({
      brokerURL: '/wsa/twitch-status', // Adres backendu
      reconnectDelay: 10000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.stompClient.onConnect = (frame: Frame) => {
      //console.log('Connected: ', frame);
      //this.sessionId = frame.headers['user-name'];
      //console.log(this.sessionId);
      this.subscribeToStatuses();
    };

    this.stompClient.activate();

  }

  private subscribeToStatuses() {
    this.stompClient.subscribe('/topic/twitch-status', message => {
      const data = JSON.parse(message.body);
      //console.log('Twitch status update: ', data);
      this.online = data.live;
    });

    this.stompClient.subscribe('/user/queue/status', message => {
      const data = JSON.parse(message.body);
      //console.log('XOtrzymane statusyX:', data);
      this.online = data.live;
    });

    this.stompClient.publish({
      destination: '/topic/twitch-status',
      body: JSON.stringify({ message: 'ping' })
    });

    this.stompClient.publish({
      destination: '/app/status',
      body: JSON.stringify({ message: 'ping' })
    });

  }*/
}
