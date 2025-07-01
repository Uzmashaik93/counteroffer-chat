"use client";

import { Message, RegularMessage } from "@/socket-server";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { products } from "../products";
import Image from "next/image";
import { TextMessageBlock } from "./TextMessageBlock";
import { TimeStamp } from "./TimeStamp";

export default function BuyerChatUI() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const pendingCounterOffer = messages.find(
    (msg) => msg.type === "counter_offer" && msg.status === "pending"
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedProduct = products[0]; // Assuming you want to display the first product
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
      sender: "buyer",
      message: input,
    };
    socket.emit("send_message", payload);

    setInput("");
  };

  const sendOffer = (amount: number) => {
    const payload = {
      type: "counter_offer",
      sender: "buyer",
      amount,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    socket.emit("send_message", payload);
  };

  return (
    <div className="w-1/2 flex bg-gray-100 h-[90vh] ml-auto mr-auto border border-gray-300 shadow-lg my-4">
      {/* Chat Window */}
      <main className="flex-1 flex flex-col ">
        {/* Header */}
        <div className="h-auto flex-wrap bg-white border-b border-b-gray-300 px-4 flex items-center">
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
          <div className="ml-auto mr-auto mb-2">
            {!pendingCounterOffer && <OfferBlock sendOffer={sendOffer} />}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.sender === "buyer";

            return msg.type === "counter_offer" ? (
              msg.status === "pending" ? (
                <p className="text-center text-sm text-gray-800">
                  You sent an offer of
                  <span className="font-semibold"> {msg.amount} EUR</span> for
                  this item.
                  <span className="text-xs text-gray-500 px-2 ">
                    <TimeStamp timestamp={msg.timestamp} />
                  </span>
                </p>
              ) : null
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
              className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring focus:border-blue-300"
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

const OfferBlock = ({ sendOffer }: { sendOffer: (amount: number) => void }) => {
  const [showInput, setShowInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  return (
    <div className="mt-[27px]">
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition"
        >
          Offer
        </button>
      )}
      <div className="flex flex-wrap gap-3 justify-center mt-[24px]">
        {showInput && (
          <div className="flex flex-col text-xs">
            <input
              type="number"
              onChange={(e) => setOfferAmount(e.target.value)}
              value={offerAmount}
              placeholder="Enter your offer amount"
              className="px-4 py-2 border border-gray-300 rounded-md shadow text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => sendOffer(Number(offerAmount))}
              className="mt-2 bg-black text-white px-2 py-2 text-xs hover:bg-gray-800"
            >
              Submit Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
