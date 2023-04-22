"use client";

import Image from "next/image";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, KeyboardEvent, Suspense } from "react";
import { AiChatBubble } from "./ChatBubble/AiChatBubble";
import { UserChatBubble } from "./ChatBubble/UserChatBubble";
import { MessageType } from "@prisma/client";
import { useSessionContext } from "../context/SessionContext";
import { useParams } from "next/navigation";

const exampleQuery = [
  "Explain quantum computing in simple terms",
  "Who is the best girl in Oshi no Ko and why is it Akane",
  "Kenapa Tugas Besar IF banyak sekali saya lelah mau turu",
];

interface IMessage {
  id: number;
  type: MessageType;
  content: string;
}

export default function ChatBox({ messages }: { messages: IMessage[] }) {
  const [chatlog, setChatlog] = useState(messages);
  const [message, setMessage] = useState("");
  const { sessions, setSessions, currentSession, setCurrentSession } =
    useSessionContext();
  const messageAreaRef = useRef<null | HTMLTextAreaElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);
  const param = useParams();

  useEffect(() => {
    if (messageAreaRef.current != null) {
      messageAreaRef.current.style.height = "auto";
      messageAreaRef.current.style.height =
        Math.min(messageAreaRef.current.scrollHeight, 72) + "px";
    }
  }, [message]);

  useEffect(() => {
    const bottom = document.getElementById("bottom");
    if (bottom != null) {
      bottom.scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  useEffect(() => {
    if (currentSession === undefined) {
      setChatlog([]);
    }
  }, [currentSession]);

  function handleSend() {
    if (message != "") {
      setChatlog([
        ...chatlog,
        {
          id: 8214786375,
          type: MessageType.USER,
          content: message,
        },
      ]);
      setMessage("");
      if (chatlog.length == 0) {
        let newId = Math.ceil(Math.random() * 1000) + 3;
        setSessions([{ id: newId, name: message }, ...sessions]);
        setCurrentSession(newId.toString());
      }
    }
  }

  function onEnterPress(e: KeyboardEvent) {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-between">
      {chatlog.length == 0 && (
        <div className="scrollbar-hide w-full h-full flex flex-col space-y-8 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-20 h-20 sm:w-40 sm:h-40">
              <Image
                src={"/shiba.png"}
                alt="shiba-ai-logo"
                fill
                sizes="(max-width: 768px) 80px,
              (max-width: 1200px) 160px,
              80px"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-center text-slate-200">
              SHIBAl
            </h1>
          </div>
          <p className="text-lg sm:text-2xl">Example Query</p>
          <ul className="space-y-4">
            {exampleQuery.map((query) => {
              return (
                <li
                  key={query}
                  className="w-full sm:w-96 bg-blur px-8 py-4 text-center hover:cursor-pointer hover:bg-opacity-30"
                  onClick={(e) => {
                    e.preventDefault();
                    setMessage(query);
                    if (messageAreaRef.current != null) {
                      messageAreaRef.current.focus();
                    }
                  }}
                >
                  <p>{`"${query}" →`}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {chatlog.length > 0 && (
        <ul id="chat-box" className="w-full overflow-scroll scrollbar-hide">
          {chatlog.map((chat) => {
            return (
              <li key={chat.id}>
                {chat.type == MessageType.USER && (
                  <UserChatBubble message={chat.content} />
                )}
                {chat.type == MessageType.SYSTEM && (
                  <AiChatBubble message={chat.content} />
                )}
              </li>
            );
          })}
          <div id="bottom" />
        </ul>
      )}

      <div className="w-full flex flex-col justify-center items-center pb-4">
        <div
          id="chat-input"
          className="px-0 md:px-24 lg:px-48 py-4 w-full flex flex-row justify-center items-stretch"
        >
          <form
            ref={formRef}
            className="w-full h-full px-8 py-4 flex flex-row bg-blur space-x-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <textarea
              rows={1}
              placeholder="Send a message..."
              className="w-full resize-none bg-transparent focus:outline-none"
              value={message}
              ref={messageAreaRef}
              onChange={(e) => {
                setMessage(e.currentTarget.value);
              }}
              onKeyDown={onEnterPress}
            />
            <button className="h-full" type="submit">
              <PaperPlaneIcon
                className="-rotate-45"
                style={{ height: "100%", width: 20 }}
              />
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-600">Made by しば-L team</p>
      </div>
    </main>
  );
}
