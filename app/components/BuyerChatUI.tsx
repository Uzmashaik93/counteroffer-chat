"use client";

import { Chat, SendMessageEvent, UpdateOfferEvent } from "@/socket-server";
import { useEffect, useRef, useState } from "react";
import socket, {
  getHistory,
  sendMessage,
  startChat,
  turnOffGetHistory,
} from "@/lib/socket";
import { Product, products, questionnaire, sellers } from "../constants";
import Image from "next/image";
import { OfferBlock } from "./OfferBlock";
import CounterOfferMessageLine from "./CounterOfferMessageLine";
import { getUserId } from "@/lib/user";

export default function BuyerChatUI() {
  const userId = getUserId();
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
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

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    if (isMobile) {
      setShowChatPanel(true);
    }
  };

  // const pendingCounterOffer = chat.find(
  //   (msg) =>
  //     msg.type === "counter_offer" &&
  //     msg.status === "pending" &&
  //     msg.sender === "buyer"
  // );

  const pendingCounterOfferBySeller = chat?.counterOffers.find(
    (msg) =>
      msg.type === "counter_offer" &&
      msg.status === "pending" &&
      msg.sender === "seller"
  );

  // const isOfferAccepted = Boolean(
  //   chat.find(
  //     (message) =>
  //       message.type === "counter_offer" && message.status === "accepted"
  //   )
  // );

  useEffect(() => {
    socket.on("message_history", (chat?: Chat) => {
      console.log(chat);
      setChat(chat);
    });

    if (userId && selectedProduct.sellerId) {
      startChat({
        sellerId: selectedProduct.sellerId,
        buyerId: userId,
      });
      getHistory({
        sellerId: selectedProduct.sellerId,
        buyerId: userId,
      });
    }

    return () => {
      turnOffGetHistory();
    };
  }, [userId, selectedProduct]);

  useEffect(() => {
    socket.on("receive_message", (chat?: Chat) => {
      console.log(chat);
      setChat(chat);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAccept = () => {
    if (pendingCounterOfferBySeller && chat) {
      const payload: UpdateOfferEvent = {
        sellerId: chat?.sellerId,
        buyerId: chat?.buyerId,
        messageId: pendingCounterOfferBySeller.id,
        status: "history",
        offer: {
          ...pendingCounterOfferBySeller,
          status: "accepted",
          timestamp: new Date().toISOString(),
          sender: "buyer",
        },
      };
      socket.emit("update_counter_offer", payload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 font-sans bg-white p-4">
      <div className="flex flex-1 rounded-md shadow-lg border border-gray-200 overflow-hidden flex-col md:flex-row md:ml-20 md:mr-20 md:mt-4">
        {/* Sidebar */}
        <aside
          className={`md:w-1/3 border-r border-gray-100 ${
            isMobile && showChatPanel ? "hidden" : "block"
          }`}
        >
          <div className="border-b border-b-gray-200">
            <h2 className="text-lg mt-4 mb-4 text-center">Messages</h2>
          </div>
          <ul className="space-y-5">
            {products.map((product) => {
              const seller = sellers.find(
                (seller) => seller.id === product.sellerId
              );

              return (
                <li
                  key={product.id}
                  className={`flex flex-col cursor-pointer p-2 transition rounded ${
                    selectedProduct?.id === product.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelect(product)}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
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
                          src={product.image || "/placeholder.png"}
                          width={40}
                          height={40}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{seller?.handle}</p>
                          <p className="text-sm text-gray-600 underline">
                            {product.name}
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
          </ul>
        </aside>

        {/* Main Panel */}
        <main
          className={`md:block md:w-2/3 pr-4 pl-4 pt-1 ${
            isMobile && !showChatPanel ? "hidden" : "block"
          }`}
        >
          {/* Back button for mobile */}
          {isMobile && showChatPanel && (
            <button
              className="mb-4 text-black font-semibold"
              onClick={() => setShowChatPanel(false)}
            >
              &larr; Back to Messages
            </button>
          )}
          {selectedProduct && (
            <div>
              {/* Seller Info */}
              <div className="flex justify-center items-center gap-4 mb-1">
                <Image
                  src={selectedProduct.image || "/placeholder.png"}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10"
                  alt={selectedProduct.name}
                />
                <h2 className="text-xl text-center">
                  {selectedProduct.sellerId || "@Seller"}
                </h2>
              </div>

              {/* Product Info */}
              <div className="flex gap-6 border border-gray-100 p-4 rounded-md shadow-sm mb-3">
                <Image
                  src={selectedProduct.image || "/placeholder.png"}
                  width={128}
                  height={96}
                  alt={selectedProduct.name}
                  className="w-32 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-md font-semibold">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-700 font-medium">
                    {selectedProduct.price} EUR
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.condition || "Very good condition"}
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

              <p className="text-sm text-gray-600 mb-3 italic text-center">
                {selectedProduct.sellerId} typically replies within 1–2 hours
              </p>
              <div className="flex flex-col justify-center items-center gap-3">
                {chat?.counterOffers.map((msg) => {
                  const isOwnMessage = msg.sender === "buyer";

                  return (
                    // <div key={offer.id}>
                    //   {offer.sender === "buyer" ? (
                    //     <p>
                    //       You offered {offer.amount} EUR.{" "}
                    //       {offerStatusMessageMap[offer.status]}
                    //     </p>
                    //   ) : (
                    //     <p></p>
                    //   )}
                    //   <TimeStamp timestamp={offer.timestamp} />
                    // </div>
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
                      <div key={msg.id}>
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

                        {msg.sender === "seller" &&
                          msg.status === "pending" && (
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
                  );
                })}
              </div>
              <p className="text-center text-xs text-gray-500 mt-5 mb-5">
                You have{" "}
                {3 -
                  (chat?.counterOffers.filter((x) => x.sender === "buyer")
                    .length || 0)}{" "}
                counter-offer remaining.
              </p>
              <ChatActions product={selectedProduct} chat={chat} />
              {chat && <ChatList chat={chat} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ChatActions({ product, chat }: { product: Product; chat?: Chat }) {
  const userId = getUserId();
  // Do not show Offer button when the counterOffer reaches 3
  const categories = [
    ...((chat?.counterOffers.filter((x) => x.sender === "buyer").length || 0) >
    2
      ? []
      : ["Offer"]),
    "Delivery",
    "Product",
    "Payment",
    "Other",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const questions = questionnaire.find(
    (questions) => questions.category === selectedCategory
  );

  const handleQuestionSelect = (question: string) => {
    const message: SendMessageEvent = {
      sellerId: product.sellerId,
      buyerId: userId,
      message: {
        type: "message",
        sender: "buyer",
        message: question,
        timestamp: new Date().toISOString(),
      },
    };
    sendMessage(message);
    setSelectedCategory(null);
  };

  const handleSendOffer = (amount: number) => {
    const payload: UpdateOfferEvent = {
      sellerId: product.sellerId,
      buyerId: userId,
      messageId: "unknown",
      status: "history",
      offer: {
        type: "counter_offer",
        sender: "buyer",
        amount,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
    };
    socket.emit("update_counter_offer", payload);
    setSelectedCategory(null);
  };

  const getShowCategoryOptions = () => {
    if (selectedCategory) {
      return false;
    }

    if (
      chat?.messages &&
      chat.messages.length > 0 &&
      chat.messages.length % 2 !== 0
    ) {
      return false;
    }

    return true;
  };

  const showCategoryOptions = getShowCategoryOptions();

  return (
    <>
      {showCategoryOptions && (
        <>
          <p className="text-xs mb-5 text-center ">
            What would you like to ask about?
          </p>
          <div className="w-[344px] mr-auto ml-auto">
            <div className="flex gap-3 justify-center flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-5 py-2 text-sm text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col gap-3">
        {selectedCategory &&
          questions &&
          questions.questions.map((item, id) => (
            <p
              key={id}
              onClick={() => handleQuestionSelect(item.question)}
              className="bg-white border border-gray-200 shadow-md text-center ml-auto mr-auto text-sm px-4 py-2 max-w-[75%] rounded-xl cursor-pointer hover:bg-gray-200 transition"
            >
              {item.question}
            </p>
          ))}
      </div>

      {selectedCategory === "Offer" &&
        (!chat?.counterOffers?.length || // No counter offers
          !chat.counterOffers.some(
            (x) => x.sender === "buyer" && x.status === "pending"
          )) && ( // No pending counteroffer from buyer
          <OfferBlock sendOffer={handleSendOffer} />
        )}
    </>
  );
}

function ChatList({ chat }: { chat: Chat }) {
  return (
    <div className="flex flex-col gap-4 my-4">
      {chat.messages?.map((message) => {
        const isBuyer = message.sender === "buyer";
        const senderName = isBuyer ? "You" : chat.sellerId || "Seller";

        const initials = isBuyer
          ? "YO" // or derive from buyer name if available
          : chat.sellerId
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2) || "?";

        return (
          <div
            key={message.id}
            className={`flex flex-col ${isBuyer ? "items-end" : "items-start"}`}
          >
            {/* Header: Avatar + Name + Timestamp */}
            <div
              className={`flex items-center text-xs text-black mb-1 ${
                isBuyer ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar with initials */}
              <div
                className={`w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white ${
                  isBuyer ? "ml-2" : "mr-2"
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
                isBuyer
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
