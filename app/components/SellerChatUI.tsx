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

  const sendCounterOffer = (id: string, amount: number) => {
    const payload = {
      type: "counter_offer",
      sender: "seller",
      amount,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    socket.emit("update_counter_offer", {
      messageId: id,
      status: "rejected",
      newMessage: payload,
    });
  };

  return (
    <div className="w-full flex bg-gray-100 h-[90vh]">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white border-r border-r-gray-300 flex flex-col">
        <div className="p-4 border-b border-b-gray-300 font-semibold text-lg">
          Messages
        </div>
        <ul className="overflow-y-auto flex-1">
          {products.map((product, i) => (
            <li
              key={i}
              onClick={() => setSelectedProduct(product)}
              className={`p-4 hover:bg-gray-100 cursor-pointer border-b border-b-gray-200 text-sm font-bold ${
                selectedProduct.name === product.name ? "bg-gray-100" : ""
              }`}
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
        <div className="h-auto bg-white border-b border-b-gray-300 px-4 flex items-center gap-4">
          <Image
            src={selectedProduct.image}
            alt={selectedProduct.name}
            width={200}
            height={200}
            className="rounded-md"
          />
          <div className="flex flex-col justify-center gap-2">
            <div className=" text-sm font-bold">{selectedProduct.name}</div>
            <div className="text-xs text-black font-bold">
              EUR {selectedProduct.price}
            </div>
            <div className="text-xs text-gray-500">
              {selectedProduct.condition}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.sender === "seller";

            return msg.type === "counter_offer" ? (
              <CounterOfferMessageBlock
                key={idx}
                message={msg}
                sendCounterOffer={sendCounterOffer}
              />
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
        <div className="p-4 border-t border-t-gray-300 bg-white">
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
              className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
