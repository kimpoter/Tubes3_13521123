import { TokensIcon } from "@radix-ui/react-icons";
import React from "react";

function AiChatBubbleLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: String;
}) {
  return (
    <div className={`chat-bubble bg-blur text-slate-400 ` + className}>
      <div className={`flex-shrink-0`}>
        <TokensIcon style={{ height: "100%", width: 24 }} />
      </div>
      {children}
    </div>
  );
}

export function AiChatBubble({
  message,
  isLoading = false,
}: {
  message: String;
  isLoading?: boolean;
}) {
  return (
    <AiChatBubbleLayout>
      {isLoading && (
        <div className="w-full flex flex-col space-y-3">
          <div className="w-full bg-blur h-4 animate-pulse" />
          <div className="w-2/3 bg-blur h-4 animate-pulse" />
        </div>
      )}

      {!isLoading && <p>{message}</p>}
    </AiChatBubbleLayout>
  );
}

export function ErrorChatBubble({
  message,
  question,
}: {
  message: String;
  question: String;
}) {
  return (
    <AiChatBubbleLayout className={"bg-blur-error"}>
      <div className="w-full flex flex-col space-y-4">
        <p>{message}</p>
        <button className="w-full bg-blur px-8 py-3 text-center hover:cursor-pointer hover:bg-opacity-30">
          Regenerate answer
        </button>
      </div>
    </AiChatBubbleLayout>
  );
}

export function OptionChatBubble({
  options,
  onClick,
}: {
  options: string[];
  onClick: (option: string) => void;
}) {
  return (
    <AiChatBubbleLayout>
      <div className="w-full flex flex-col space-y-4">
        <p>Pertanyaan tidak ditemukan di database. Apakah maksud Anda:</p>
        {options.map((option, index: number) => {
          return (
            <button
              key={index}
              onClick={(e) => onClick(option)}
              className="w-full bg-blur px-8 py-3 text-center hover:cursor-pointer hover:bg-opacity-30"
            >
              {`"${option}" →`}
            </button>
          );
        })}
      </div>
    </AiChatBubbleLayout>
  );
}
