import { cn } from "@/utils/cn";

// On définit l'interface pour correspondre à ce qu'on envoie depuis ChatWindow
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatMessageBubble(props: {
  message: Message; // Utilise notre interface simple
  aiEmoji?: string;
}) {
  const isUser = props.message.role === "user";

  return (
    <div
      className={cn(
        "rounded-[24px] max-w-[80%] mb-8 flex",
        isUser ? "bg-secondary text-secondary-foreground px-4 py-2 ml-auto" : "mr-auto"
      )}
    >
      {/* Avatar de l'IA */}
      {!isUser && (
        <div className="mr-4 border bg-secondary -mt-2 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
          {props.aiEmoji || "🤖"}
        </div>
      )}

      <div className="whitespace-pre-wrap flex flex-col">
        {/* Affichage direct du contenu du message */}
        <span>{props.message.content}</span>
      </div>
    </div>
  );
}