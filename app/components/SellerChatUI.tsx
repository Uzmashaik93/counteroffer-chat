"use client";

import { Message, RegularMessage } from "@/socket-server";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { products } from "../products";
import Image from "next/image";
import { CounterOfferMessageBlock } from "./CounterOffer";
import { TextMessageBlock } from "./TextMessageBlock";

export default function SellerChatUI() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const isOfferAccepted = Boolean(
    messages.find(
      (message) =>
        message.type === "counter_offer" && message.status === "accepted"
    )
  );

  useEffect(() => {
    socket.emit("get_history");
    socket.on("message_history", (history: Message[]) => {
      console.log("History received:", history);
      setMessages(history);
    });
    socket.on("receive_message", (messages) => {
      console.log(messages);
      setMessages(messages);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_history");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const payload = {
      type: "message",
      sender: "seller",
      message: input,
    };
    socket.emit("send_message", payload);

    setInput("");
  };

  return (
    <div className="w-full h-[90vh] flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-1/4 bg-white border-b md:border-b-0 md:border-r border-gray-300 flex-col">
        <div className="p-4 border-b border-gray-300 font-semibold text-lg">
          Messages
        </div>
        <ul className="overflow-y-auto flex-1">
          {products.map((product, i) => (
            <li
              key={i}
              onClick={() => setSelectedProduct(product)}
              className={`p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 text-sm font-bold ${
                selectedProduct.name === product.name ? "bg-gray-100" : ""
              }`}
            >
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <Image
                    width={60}
                    height={60}
                    src={product.image}
                    alt={product.name}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="text-xs font-bold">
                  <div>{product.name}</div>
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
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border-b border-gray-300 px-4 py-2">
          <Image
            src={selectedProduct.image}
            alt={selectedProduct.name}
            width={100}
            height={100}
            className="rounded-md object-cover"
          />
          <div className="flex flex-col justify-center gap-2 flex-1">
            <div className="text-base sm:text-sm font-bold">
              {selectedProduct.name}
            </div>
            <div className="text-sm sm:text-xs text-black font-bold">
              EUR {selectedProduct.price}
            </div>
            <div className="text-xs text-gray-500">
              {selectedProduct.condition}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.sender === "seller";
            return msg.type === "counter_offer" ? (
              <CounterOfferMessageBlock key={idx} message={msg} />
            ) : (
              <TextMessageBlock
                key={idx}
                isOwnMessage={isOwnMessage}
                message={msg as RegularMessage}
              />
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!isOfferAccepted && (
          <div className="p-2 sm:p-4 border-t border-gray-300 bg-white">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none w-full"
              />
              <button
                onClick={sendMessage}
                className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 w-full sm:w-auto"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
