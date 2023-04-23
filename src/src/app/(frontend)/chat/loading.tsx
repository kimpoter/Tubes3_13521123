import { MessageType } from "@prisma/client";
import { AiChatBubble } from "./components/ChatBubble/AiChatBubble";
import { UserChatBubble } from "./components/ChatBubble/UserChatBubble";

const dummy = [
  { id: 1, type: MessageType.USER, content: "" },
  { id: 2, type: MessageType.SYSTEM, content: "" },
  { id: 3, type: MessageType.USER, content: "" },
  { id: 4, type: MessageType.SYSTEM, content: "" },
];

export default function Loading() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-between">
      <ul id="chat-box" className="w-full overflow-scroll scrollbar-hide">
        {dummy.map((chat) => {
          return (
            <li key={chat.id}>
              {chat.type == MessageType.USER && (
                <UserChatBubble message={chat.content} isLoading />
              )}
              {chat.type == MessageType.SYSTEM && (
                <AiChatBubble message={chat.content} isLoading />
              )}
            </li>
          );
        })}
        <div id="bottom" />
      </ul>
    </main>
  );
}
