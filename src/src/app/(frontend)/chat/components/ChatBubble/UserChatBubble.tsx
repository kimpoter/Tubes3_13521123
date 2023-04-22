import { TokensIcon } from "@radix-ui/react-icons";

export function UserChatBubble({
  message,
  isLoading = false,
}: {
  message: String;
  isLoading?: boolean;
}) {
  return (
    <div className={`chat-bubble`}>
      <div className={`flex-shrink-0 text-transparent`}>
        <TokensIcon style={{ height: "100%", width: 24 }} />
      </div>

      {isLoading && (
        <div className="w-full flex flex-col space-y-3">
          <div className="w-full bg-blur h-4 animate-pulse" />
          <div className="w-2/3 bg-blur h-4 animate-pulse" />
        </div>
      )}

      {!isLoading && <p>{message}</p>}
    </div>
  );
}
