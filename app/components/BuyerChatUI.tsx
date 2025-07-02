"use client";

import { Message, RegularMessage } from "@/socket-server";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { products } from "../products";
import Image from "next/image";
import { TextMessageBlock } from "./TextMessageBlock";
import { OfferBlock } from "./OfferBlock";
import CounterOfferMessageLine from "./CounterOfferMessageLine";
import LogoutButton from "./LogoutButton";

export default function BuyerChatUI() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const pendingCounterOffer = messages.find(
    (msg) =>
      msg.type === "counter_offer" &&
      msg.status === "pending" &&
      msg.sender === "buyer"
  );

  const pendingCounterOfferBySeller = messages.find(
    (msg) =>
      msg.type === "counter_offer" &&
      msg.status === "pending" &&
      msg.sender === "seller"
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedProduct = products[0]; // Assuming we want to chat for the first product

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
    socket.emit("update_counter_offer", {
      messageId: pendingCounterOfferBySeller?.id,
      status: "rejected",
      newMessage: payload,
    });
  };

  const handleAccept = () => {
    if (pendingCounterOfferBySeller) {
      socket.emit("update_counter_offer", {
        messageId: pendingCounterOfferBySeller.id,
        status: "accepted",
        newMessage: {
          ...pendingCounterOfferBySeller,
          status: "accepted",
          timestamp: new Date().toISOString(),
          sender: "buyer",
        },
      });
    }
  };

  const handleClearHistory = () => {
    socket.emit("clear_history");
  };

  return (
    <div className="m-5">
      <button
        onClick={handleClearHistory}
        className=" px-2 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition mb-2 ml-2"
      >
        Reset the chat
      </button>
      <LogoutButton />
      <div className="w-full max-w-2xl flex bg-gray-100 h-[90vh] mx-auto border border-gray-300 shadow-lg my-4 rounded-lg md:w-1/2">
        {/* Chat Window */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex flex-col md:flex-row flex-wrap bg-white border-b border-b-gray-300 px-4 py-2 items-center gap-4">
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              width={120}
              height={120}
              className="rounded-md object-cover"
            />
            <div className="flex flex-col justify-center gap-2 flex-1">
              <div className="text-base md:text-sm font-bold">
                {selectedProduct.name}
              </div>
              <div className="text-sm md:text-xs text-black font-bold">
                EUR {selectedProduct.price}
              </div>
              <div className="text-xs text-gray-500">
                {selectedProduct.condition}
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center md:ml-auto md:mr-auto mb-2">
              {!pendingCounterOffer && <OfferBlock sendOffer={sendOffer} />}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4">
            {messages.map((msg, idx) => {
              const isOwnMessage = msg.sender === "buyer";

              return msg.type === "counter_offer" ? (
                isOwnMessage ? (
                  msg.status === "accepted" ? (
                    <p className="text-center text-green-600 text-sm font-semibold mt-4">
                      Offer accepted at {msg.amount} EUR by you.
                    </p>
                  ) : (
                    <CounterOfferMessageLine
                      key={msg.id}
                      amount={msg.amount}
                      timestamp={msg.timestamp}
                      action={"sent"}
                    />
                  )
                ) : (
                  <div key={idx}>
                    {msg.status === "accepted" ? (
                      <p className="text-center text-green-600 text-sm font-semibold mt-4">
                        Offer accepted at {msg.amount} EUR by seller.
                      </p>
                    ) : msg.status === "rejected" ? (
                      <p className="text-center text-red-600 text-sm font-semibold mt-4">
                        Offer declined by seller.
                      </p>
                    ) : (
                      <CounterOfferMessageLine
                        key={msg.id}
                        amount={msg.amount}
                        timestamp={msg.timestamp}
                        action="received"
                      />
                    )}

                    {msg.sender === "seller" && msg.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleAccept}
                          className="px-2 py-2 bg-white text-sm ml-auto mr-auto border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition"
                        >
                          Accept Offer
                        </button>
                      </div>
                    )}
                  </div>
                )
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
          <div className="p-2 md:p-4 border-t border-t-gray-300 bg-white">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none w-full"
              />
              <button
                onClick={sendMessage}
                className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 w-full md:w-auto"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
