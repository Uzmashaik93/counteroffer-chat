"use client";

import { Chat, SendMessageEvent } from "@/socket-server";
import { useEffect, useRef, useState } from "react";
import socket, {
  getHistory,
  sendMessage,
  startChat,
  turnOffGetHistory,
} from "@/lib/socket";
import {
  Offering,
  offerings,
  Product,
  products,
  questionnaire,
  sellers,
} from "../constants";
import Image from "next/image";
import { CounterOfferMessageBlock } from "./CounterOffer";

import { getUserId } from "@/lib/user";

interface OfferingWithProduct extends Offering {
  product: Product;
}

export default function SellerChatUI() {
  const userId = getUserId();

  const productsInOffering = offerings
    .map((offering) => {
      const product = products.find(
        (product) =>
          product.id === offering.productId && product.sellerId === userId
      );
      return {
        ...offering,
        product,
      };
    })
    .filter(
      (offering) => offering.product !== undefined
    ) as OfferingWithProduct[];

  const [selectedOffering, setSelectedOffering] = useState(
    productsInOffering[0]
  );
  const [activeTab, setActiveTab] = useState("Listings");

  const [isMobile, setIsMobile] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chat, setChat] = useState<Chat | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (offering: OfferingWithProduct) => {
    setSelectedOffering(offering);
    if (isMobile) {
      setShowChatPanel(true);
    }
  };

  useEffect(() => {
    socket.on("message_history", (chat?: Chat) => {
      console.log(chat);
      setChat(chat);
    });

    if (userId && selectedOffering?.id && selectedOffering.buyerId) {
      startChat({
        buyerId: selectedOffering.buyerId,
        sellerId: userId,
      });
      getHistory({
        buyerId: selectedOffering.buyerId,
        sellerId: userId,
      });
    }

    return () => {
      turnOffGetHistory();
    };
  }, [userId, selectedOffering]);

  useEffect(() => {
    socket.on("receive_message", (chat?: Chat) => {
      console.log("Seller received chat:", chat);
      if (chat) setChat(chat);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // const sendMessage = () => {
  //   const payload = {
  //     type: "message",
  //     sender: "seller",
  //     message: input,
  //   };
  //   socket.emit("send_message", payload);
  //   setInput("");
  // };

  // const isOfferAccepted = Boolean(
  //   messages.find(
  //     (message) =>
  //       message.type === "counter_offer" && message.status === "accepted"
  //   )
  // );

  // useEffect(() => {
  //   socket.emit("get_history");
  //   socket.on("message_history", (history: Message[]) => {
  //     console.log("History received:", history);
  //     setMessages(history);
  //   });
  //   socket.on("receive_message", (messages) => {
  //     console.log(messages);
  //     setMessages(messages);
  //   });

  //   return () => {
  //     socket.off("receive_message");
  //     socket.off("message_history");
  //   };
  // }, []);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // const sendMessage = () => {
  //   const payload = {
  //     type: "message",
  //     sender: "seller",
  //     message: input,
  //   };
  //   socket.emit("send_message", payload);

  //   setInput("");
  // };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 font-sans bg-white p-4">
      <div className="flex flex-1 rounded-md shadow-lg border border-gray-200 overflow-hidden flex-col md:flex-row md:ml-20 md:mr-20 md:mt-4">
        {/* Sidebar */}
        <aside
          className={`md:w-1/3 border-r border-gray-200 ${
            isMobile && showChatPanel ? "hidden" : "block"
          }`}
        >
          <h2 className="text-lg mt-4 mb-4 text-center">Messages</h2>

          {/* Tabs */}
          <div className="flex border-t border-b border-gray-100 divide-x divide-gray-300">
            {["Orders", "Listings"].map((tab, index) => (
              <button
                key={index}
                className={`w-1/2 py-4 text-sm font-semibold relative ${
                  activeTab === tab ? "text-black" : "text-gray-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400" />
                )}
              </button>
            ))}
          </div>

          {/* Product List */}
          <ul>
            {activeTab === "Listings" &&
              productsInOffering.map((offering) => {
                const seller = sellers.find(
                  (s) => s.id === offering.product?.sellerId
                );

                return (
                  <li
                    key={offering.id}
                    className={`flex flex-col cursor-pointer p-2 transition rounded ${
                      selectedOffering?.id === offering.id
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(offering)}
                  >
                    <div className="flex items-start gap-1 mb-1">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
                        {seller?.handle
                          ? seller.handle
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                          : "?"}
                      </div>
                      <div className="flex flex-col justify-start gap-2">
                        <div className="flex justify-between">
                          <div className="text-xs text-gray-500 font-semibold">
                            @{seller?.handle || "Buyer"}
                          </div>
                          <div className="text-xs text-gray-400">1h ago</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Image
                            src={offering.product.image || "/placeholder.png"}
                            width={40}
                            height={40}
                            alt={offering.product.name}
                            className="w-14 h-14 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{seller?.handle}</p>
                            <p className="text-sm text-gray-600 underline">
                              {offering.product.name}
                            </p>
                            <p className="text-xs italic text-gray-500">
                              Is the item in good condition?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}

            {activeTab === "Orders" && (
              <div className="text-center text-sm text-gray-500 py-8">
                No orders yet.
              </div>
            )}
          </ul>
        </aside>

        {/* Main Panel */}
        <main
          className={`mb-10 md:block md:w-2/3 pr-4 pl-4 pt-1 ${
            isMobile && !showChatPanel ? "hidden" : "block"
          }`}
        >
          {isMobile && showChatPanel && (
            <button
              className="mb-4 text-black font-semibold"
              onClick={() => setShowChatPanel(false)}
            >
              &larr; Back to Messages
            </button>
          )}
          {selectedOffering && (
            <div>
              <div className="flex justify-center items-center gap-4 mb-1">
                <Image
                  src={selectedOffering.product?.image || "/placeholder.png"}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10"
                  alt={selectedOffering.product?.name || ""}
                />
                <h2 className="text-xl text-center">
                  {selectedOffering.product?.sellerId || "@Seller"}
                </h2>
              </div>

              <div className="flex gap-6 border border-gray-100 p-4 rounded-md shadow-sm mb-3">
                <Image
                  src={selectedOffering.product?.image || "/placeholder.png"}
                  width={128}
                  height={96}
                  alt={selectedOffering.product?.name || ""}
                  className="w-32 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-md font-semibold">
                    {selectedOffering.product?.name}
                  </h3>
                  <p className="text-gray-700 font-medium">
                    {selectedOffering.product?.price} EUR
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedOffering.product?.condition ||
                      "Very good condition"}
                  </p>
                  <a
                    href={"#"}
                    className="text-blue-600 underline text-sm mt-1 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Product Page
                  </a>
                </div>
              </div>

              <div>
                {chat?.counterOffers.map((offer) => (
                  <CounterOfferMessageBlock
                    key={offer.id}
                    message={offer}
                    sellerId={chat.sellerId}
                    buyerId={chat.buyerId}
                  />
                ))}
              </div>
            </div>
          )}
          {chat && <ChatList chat={chat} />}
          {chat && <AnswerSection chat={chat} />}
          <div ref={bottomRef} />
        </main>
      </div>
    </div>
  );
}

function ChatList({ chat }: { chat: Chat }) {
  return (
    <div className="flex flex-col gap-4 my-4">
      {chat?.messages?.map((message) => {
        const isYourMessage = message.sender === "seller";
        const senderName = isYourMessage ? "You" : chat.buyerId || "Buyer";

        const initials = isYourMessage
          ? "YO" // or derive from buyer name if available
          : chat.sellerId
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2) || "?";

        return (
          <div
            key={message.id}
            className={`flex flex-col ${
              isYourMessage ? "items-end" : "items-start"
            }`}
          >
            {/* Header: Avatar + Name + Timestamp */}
            <div
              className={`flex items-center text-xs text-black mb-1 ${
                isYourMessage ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar with initials */}
              <div
                className={`w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white ${
                  isYourMessage ? "ml-2" : "mr-2"
                }`}
              >
                {initials}
              </div>

              <span className="font-medium mx-1">{senderName}</span>
              <span className="text-gray-400">
                {" "}
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[70%]  px-4 py-2 shadow-lg rounded-xl text-xs ${
                isYourMessage
                  ? "bg-white border border-gray-200 text-right"
                  : "bg-white border border-gray-200 text-left"
              }`}
            >
              {message.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Question {
  question: string;
  answers: string[];
}

function AnswerSection({ chat }: { chat: Chat }) {
  const handleAnswerSelect = (answer: string) => {
    const message: SendMessageEvent = {
      sellerId: chat.sellerId,
      buyerId: chat.buyerId,
      message: {
        type: "message",
        sender: "seller",
        message: answer,
        timestamp: new Date().toISOString(),
      },
    };
    sendMessage(message);
  };

  if (!chat) {
    return null;
  }

  const lastMessage =
    chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : undefined;
  const isLastMessageFromBuyer = lastMessage?.sender === "buyer";

  const allQuestions = isLastMessageFromBuyer
    ? questionnaire.flatMap((x) => x.questions)
    : [];

  const question = allQuestions.find(
    (x: Question) => x.question === lastMessage?.message
  );

  if (question) {
    return question.answers.map((x, id) => (
      <p
        key={id}
        onClick={() => handleAnswerSelect(x)}
        className="bg-white border mt-4 border-gray-200 shadow-md text-center ml-auto mr-auto text-sm px-4 py-2 max-w-[50%] rounded-xl cursor-pointer hover:bg-gray-200 transition"
      >
        {x}
      </p>
    ));
  }

  return null;
}
