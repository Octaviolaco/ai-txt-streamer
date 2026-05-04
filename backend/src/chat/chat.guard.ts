import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No Token')
      throw new UnauthorizedException("No token");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload; 
    } catch {
      console.log('Unauthorized Token')
      throw new UnauthorizedException("Token not verified by JwtService");
    }

    return true;
  }
}