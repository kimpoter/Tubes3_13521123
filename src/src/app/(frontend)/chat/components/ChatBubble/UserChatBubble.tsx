import { TokensIcon } from "@radix-ui/react-icons";

export function UserChatBubble({ message }: { message: String }) {
  return (
    <div className={`chat-bubble`}>
      <div className={`flex-shrink-0 text-transparent`}>
        <TokensIcon style={{ height: "100%", width: 24 }} />
      </div>
      <p>{message}</p>
    </div>
  );
}
