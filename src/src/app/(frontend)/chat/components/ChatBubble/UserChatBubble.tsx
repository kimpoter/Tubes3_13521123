import { TokensIcon } from "@radix-ui/react-icons";

export function UserChatBubble({
  message,
  isLoading = false,
}: {
  message: String;
  isLoading?: boolean;
}) {
  const lines = message.split("\n");
  return (
    <div className={`chat-bubble`}>
      <div className={`flex-shrink-0 text-transparent`}>
        <TokensIcon style={{ height: "100%", width: 24 }} />
      </div>

      {isLoading && (
        <div className="w-full flex flex-col space-y-3">
          <div className="w-full bg-blur h-3 animate-pulse" />
          <div className="w-2/3 bg-blur h-3 animate-pulse" />
        </div>
      )}

      <div className="flex flex-col">
        {!isLoading &&
          lines.map((line, index) => (
            <p key={index}>
              {line}
              {index !== lines.length - 1 && <br />}
            </p>
          ))}
      </div>
    </div>
  );
}
