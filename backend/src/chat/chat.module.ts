import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { AiService } from "./chat.aiservice";


@Module({
  providers: [ChatGateway,AiService],
  exports: [ChatGateway]
})
export class ChatModule{}
