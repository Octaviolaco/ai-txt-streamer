import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './chat.guard';
import { UseGuards } from '@nestjs/common';
import { AiService } from './chat.aiservice';

interface ChatMessage {
  text: string;
}

//@UseInterceptors() pour tej les /chaos command
@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway {

  constructor(private readonly AiService: AiService){}

  handleConnection(client: Socket) {
  console.log('Tentative de connexion détectée ! ID:', client.id);
  }
  @SubscribeMessage('NewMessage')
  handleMessage(@MessageBody() message: ChatMessage,@ConnectedSocket() client: Socket ) {
    console.log('User msg: ',message.text)
    this.AiService.getAiStream(message.text,(chunk: string)=>{
      client.emit('ai_response',chunk)
      console.log(chunk)
    })
  }
  
} 

