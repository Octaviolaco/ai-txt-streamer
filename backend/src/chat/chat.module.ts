import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { AiService } from "./chat.aiservice";
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [JwtModule],
  providers: [ChatGateway,AiService],
  exports: [ChatGateway]
})
export class ChatModule{}
