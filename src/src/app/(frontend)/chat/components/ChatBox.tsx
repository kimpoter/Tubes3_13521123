"use client";

import Image from "next/image";
import { PaperPlaneIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { AiChatBubble, OptionChatBubble } from "./ChatBubble/AiChatBubble";
import { UserChatBubble } from "./ChatBubble/UserChatBubble";
import { Message, MessageType } from "@prisma/client";
import { useSessionContext } from "../context/SessionContext";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { MessageRequestBody } from "@/lib/interfaces";
import { useSettingsContext } from "../context/SettingsContext";

const exampleQuery = [
  "Explain quantum computing in simple terms",
  "Who is the best girl in Oshi no Ko and why is it Akane",
  "Kenapa Tugas Besar IF banyak sekali saya lelah mau turu",
];

const optionRegex =
  /^Pertanyaan tidak ditemukan di database\nApakah pertanyaan yang anda maksud ini\?\n1. (.*)\n2. (.*)\n3. (.*)$/;

/**
 * get messages from server
 *
 * @param id session id
 * @param cursor pagination
 * @returns array of message and null if error
 */
async function getMessages(
  id: string | number | undefined,
  cursor: number = 0
): Promise<{ messages: Message[]; cursor: number | null } | null> {
  const res = await fetch(`/api/sessions/${id}?cursor=${cursor}&take=${99999}`);
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }

  return null;
}

/**
 * send question to the server and fetch answer
 *
 * @param body message request body
 * @returns answer to the question and null if error
 */
async function sendQuestion(body: MessageRequestBody) {
  const res = await fetch(`/api/message`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
  return null;
}

/**
 *
 * @returns ui for chat box
 */
export default function ChatBox() {
  // context
  const { sessions, setSessions, currentSession, setCurrentSession } =
    useSessionContext();
  const { algorithm } = useSettingsContext();
  // state
  const [chatlog, setChatlog] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loadMessages, setLoadMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // ref
  const messageAreaRef = useRef<null | HTMLTextAreaElement>(null);
  const formRef = useRef<null | HTMLFormElement>(null);
  // router
  const router = useRouter();

  /**
   * fetching messages
   */
  useEffect(() => {
    if (currentSession === undefined) {
      setLoadMessages(false);
      setChatlog([]);
    } else {
      setLoadMessages(true);
      getMessages(currentSession)
        .then((data) => {
          if (data) {
            if (data.messages.length == 0) router.push("/chat");
            setChatlog(data.messages.reverse());
          } else {
            router.push("/chat");
          }
        })
        .finally(() => setLoadMessages(false));
    }
    // eslint-disable-next-line
  }, []);

  /**
   * updating text area
   */
  useEffect(() => {
    if (messageAreaRef.current != null) {
      messageAreaRef.current.style.height = "auto";
      messageAreaRef.current.style.height =
        Math.min(messageAreaRef.current.scrollHeight, 36 * 5) + "px";
    }
  }, [message]);

  /**
   * updating cursor
   */
  useEffect(() => {
    const bottom = document.getElementById("bottom");
    if (bottom != null) {
      bottom.scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  /**
   * send message to the server
   */
  async function handleSend() {
    if (message != "") {
      let sessionId: string | undefined = currentSession;
      // temporary id (client side only)
      let newId = Math.ceil(Math.random() * 10000) + 3;
      // add user message
      let newChatLog: Message[] = [
        ...chatlog,
        {
          id: newId,
          type: MessageType.USER,
          content: message,

          sessionId: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setChatlog(newChatLog);
      setMessage(""); // empty textarea
      // start fetching
      setIsLoading(true);
      sendQuestion({
        choice: algorithm,
        question: message,
        sessionId: sessionId == undefined ? undefined : parseInt(sessionId),
      })
        .then((res) => {
          if (res == undefined) {
            // there is internal server error
            alert("Something is wrong");
          } else {
            // add answer to chat log
            setChatlog([...newChatLog, res]);
            if (sessionId == undefined) {
              // if session is undefined (new session)
              setSessions([
                {
                  id: res.sessionId,
                  name: message!,
                  userId: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                ...sessions,
              ]);
              setCurrentSession(res.sessionId);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  /**
   * handle submit on enter
   *
   * @param e
   */
  function onEnterPress(e: KeyboardEvent) {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSend();
    }
  }

  if (loadMessages) return <Loading />;

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
        <ul
          id="chat-box"
          className="w-full overflow-scroll scrollbar-hide pt-8"
        >
          {chatlog.map((chat, index) => {
            return (
              <li key={chat.id}>
                {chat.type == MessageType.USER && (
                  <UserChatBubble message={chat.content} />
                )}
                {chat.type == MessageType.SYSTEM &&
                  (optionRegex.test(chat.content) ? (
                    <OptionChatBubble
                      options={chat.content.split("\n").slice(2, 5)}
                      onClick={setMessage}
                    />
                  ) : (
                    <AiChatBubble message={chat.content} />
                  ))}
              </li>
            );
          })}
          {isLoading && <AiChatBubble message={""} isLoading />}
          <div id="bottom" />
        </ul>
      )}

      <div className="w-full flex flex-col justify-center items-center pb-4">
        <div className="px-0 md:px-24 lg:px-48 py-4 w-full flex flex-row justify-center items-stretch">
          <form
            ref={formRef}
            className="w-full h-full px-8 py-4 flex flex-row bg-blur space-x-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <textarea
              id="chat-input"
              rows={1}
              placeholder="Send a message..."
              className="w-full resize-none bg-transparent focus:outline-none"
              value={message}
              ref={messageAreaRef}
              onChange={(e) => {
                setMessage(e.currentTarget.value);
              }}
              onKeyDown={onEnterPress}
              disabled={isLoading}
              autoFocus
              maxLength={8000}
            />
            <button className="h-full" type="submit" disabled={isLoading}>
              {!isLoading ? (
                <PaperPlaneIcon
                  className="-rotate-45"
                  style={{ height: "100%", width: 20 }}
                />
              ) : (
                <ReloadIcon
                  className="animate-spin"
                  style={{ height: "100%", width: 20 }}
                />
              )}
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-600">Made by しば-L team</p>
      </div>
    </main>
  );
}
