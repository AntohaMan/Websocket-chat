//import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from '../app.service';
import { Chat } from '../chat.entity';
@WebSocketGateway({

  cors: {
    origin: '*',
  },
})
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}

  @WebSocketServer() server: Server;



  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    console.log(payload)
    //await this.appService.createMessage(payload);
  const k={email:payload.email,text:payload.text};
    console.log(k)
    //client.to('firstRoom').emit('recMessage', payload)
    this.server.to(`${payload.room}`).emit('recMessage', k);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, payload: any): Promise<void> {

    client.leave(payload.room);

    client.emit('dis',payload.room)
    //client.to(payload.room).emit('con',payload.room)
    //this.server.to(payload.room).emit('con',payload.room);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, payload: any): Promise<void> {

    client.join(payload.room);

    client.emit('con',payload.room)
    //client.to(payload.room).emit('con',payload.room)
    //this.server.to(payload.room).emit('con',payload.room);
  }

  afterInit(server: Server) {
    //console.log(server);
    //Выполняем действия
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    client.leave('firstRoom')
    //Выполняем действия
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Выполняем действия
  }
}
