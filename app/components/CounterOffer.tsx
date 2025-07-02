import { CounterOffer } from "@/socket-server";
import React, { useState } from "react";
import CounterOfferMessageLine from "./CounterOfferMessageLine";
import CounterOfferButtons from "./CounterOfferButtons";

export const CounterOfferMessageBlock = ({
  message,
}: {
  message: CounterOffer;
}) => {
  const [showCounterOfferInputBlock, setShowCounterOfferInputBlock] =
    useState(false);

  const isMyMessage = message.sender === "seller";

  return (
    <div className="mt-[27px]">
      {!showCounterOfferInputBlock && (
        <div>
          {isMyMessage ? (
            message.status === "accepted" ? (
              <p className="text-center text-green-600 text-sm font-semibold mt-4">
                Offer accepted at {message.amount} EUR by you.
              </p>
            ) : message.status === "rejected" ? (
              <p className="text-center text-red-600 text-sm font-semibold mt-4">
                Offer declined by you.
              </p>
            ) : (
              <CounterOfferMessageLine
                amount={message.amount}
                timestamp={message.timestamp}
                action={"sent"}
              />
            )
          ) : message.status === "accepted" ? (
            <p className="text-center text-green-600 text-sm font-semibold mt-4">
              Offer accepted at {message.amount} EUR by buyer.
            </p>
          ) : (
            <CounterOfferMessageLine
              amount={message.amount}
              timestamp={message.timestamp}
              action={"received"}
            />
          )}
        </div>
      )}

      <CounterOfferButtons
        message={message}
        showCounterOfferInputBlock={showCounterOfferInputBlock}
        setShowCounterOfferInputBlock={setShowCounterOfferInputBlock}
      />
    </div>
  );
};
