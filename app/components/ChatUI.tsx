"use client";

import { Message } from "@/socket-server";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { products } from "../products";
import Image from "next/image";

interface ChatMessageProps {
  sender: "buyer" | "seller";
}

export default function ChatUI({ sender }: ChatMessageProps) {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("receive_message", (messages) => {
      console.log(messages);
      setMessages(messages);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const payload = {
      type: "message",
      sender: sender,
      message: input,
    };
    socket.emit("send_message", payload);

    setInput("");
  };

  return (
    <div className="w-full flex bg-gray-100 h-screen absolute justify-center bottom-0 right-0">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r flex flex-col">
        <div className="p-4 border-b font-semibold text-lg">Chats</div>
        <ul className="overflow-y-auto flex-1">
          {products.map((product, i) => (
            <li
              key={i}
              className="p-4 hover:bg-gray-100 cursor-pointer border-b text-sm font-bold"
            >
              <div className="mt-2 flex items-center gap-5">
                <div>
                  <Image
                    width={100}
                    height={100}
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="text-xs font-bold">
                  <div> {product.name}</div>

                  <div>EUR {product.price}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b px-4 flex items-center justify-between">
          <div className="font-medium">Vintage Berkin</div>
          <div className="text-sm text-gray-500">Online</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.sender === sender;

            return (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  isOwnMessage ? "justify-end" : ""
                }`}
              >
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                )}

                <div
                  className={`rounded-xl p-3 text-sm max-w-xs shadow ${
                    isOwnMessage
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {msg.type === "counter_offer"
                    ? `Counter Offer: ${msg.amount}`
                    : msg.message}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
