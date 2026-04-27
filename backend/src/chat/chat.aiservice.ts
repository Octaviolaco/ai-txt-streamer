import { Injectable } from "@nestjs/common";
import { Mistral } from "@mistralai/mistralai";
import z, { ZodObject } from "zod";

export interface MistralMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string; // Optional name field
  toolCallId?: string; // Optional name field
}

@Injectable()
export class AiService {
    private mistral = new Mistral({
        apiKey: "HyRbzivPKmvqsHT3k17ChNYFdfDaAwZf",
    });

    async getAiStream(message:string, callback: (chunk: string)=>void) {
        console.log(typeof message, message)
        const messages: MistralMessage[] = [{ 
                content: message, 
                role: "user" 
            }]
        const result = await this.mistral.chat.stream({
            model: "mistral-small-latest",
            messages: messages,
        });
        
        console.log(result);

        for await (const chunk of result) {
            const content = chunk.data.choices[0].delta.content;

            if (content) {
                //transfo en string si ca ne l'est pas 
                const textToSend = (typeof content === 'string' ? content : JSON.stringify(content))
      
                callback(textToSend);
            }
        }
    } 
}



