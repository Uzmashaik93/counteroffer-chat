import { CounterOffer, UpdateOfferEvent } from "@/socket-server";
import React, { useState } from "react";
import socket from "@/lib/socket";

interface CounterOfferButtonsProps {
  sellerId: string;
  buyerId: string;
  message: CounterOffer;
  showCounterOfferInputBlock: boolean;
  setShowCounterOfferInputBlock: React.Dispatch<React.SetStateAction<boolean>>;
}

const CounterOfferButtons = ({
  message,
  showCounterOfferInputBlock,
  setShowCounterOfferInputBlock,
  buyerId,
  sellerId,
}: CounterOfferButtonsProps) => {
  const [offerAmount, setOfferAmount] = useState<number>();

  const counterOfferByBuyer = message.sender === "buyer";
  const handleOfferSubmit = () => {
    if (offerAmount && offerAmount > 0) {
      sendCounterOffer(message.id, offerAmount);
      setShowCounterOfferInputBlock(false);
      setOfferAmount(undefined);
    }
  };

  const handleAccept = () => {
    const payload: UpdateOfferEvent = {
      messageId: message.id,
      sellerId,
      buyerId,
      status: "history",
      offer: {
        ...message,
        status: "accepted",
        timestamp: new Date().toISOString(),
        sender: "seller",
      },
    };
    socket.emit("update_counter_offer", payload);
  };

  const handleDecline = () => {
    const payload: UpdateOfferEvent = {
      messageId: message.id,
      status: "history",
      sellerId,
      buyerId,
      offer: {
        ...message,
        status: "rejected",
        timestamp: new Date().toISOString(),
        sender: "seller",
      },
    };
    socket.emit("update_counter_offer", payload);
  };

  const sendCounterOffer = (id: string, amount: number) => {
    const payload: UpdateOfferEvent = {
      buyerId,
      sellerId,
      messageId: id,
      status: "history",
      offer: {
        type: "counter_offer",
        sender: "seller",
        amount,
        status: "pending",
        timestamp: new Date().toISOString(),
      },
    };
    socket.emit("update_counter_offer", payload);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-5 justify-center mt-[24px] text-xs">
        {!showCounterOfferInputBlock &&
          message.status === "pending" &&
          counterOfferByBuyer && (
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="px-2 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition"
              >
                Accept Offer
              </button>
              <button
                onClick={() => setShowCounterOfferInputBlock(true)}
                className="px-2 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-200 transition"
              >
                Counter Offer
              </button>
              <button
                onClick={handleDecline}
                className="px-2 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition"
              >
                Decline Offer
              </button>
            </div>
          )}
      </div>

      {showCounterOfferInputBlock && (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow space-y-4">
          {/* Form Fields */}
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            {/* Offer Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer your price
              </label>
              <input
                type="number"
                placeholder="Your offer"
                value={offerAmount}
                onChange={(e) =>
                  setOfferAmount(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Buyer's Price */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer’s Price
              </label>
              <div className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 bg-gray-50">
                {message.amount} EUR
              </div>
            </div>
          </div>

          {/* Centered Submit Button */}
          <div className="flex justify-center gap-2">
            <button
              onClick={handleOfferSubmit}
              className=" bg-black text-white text-sm px-3 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Submit Offer
            </button>
            <button
              onClick={() => setShowCounterOfferInputBlock(false)}
              className=" bg-black text-white text-sm px-3 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Cancel
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center">
            By making an offer, you agree to sell the product at your stated
            price if the buyer accepts it. You may make up to 3 offers for this
            product.
          </p>
        </div>
      )}
    </div>
  );
};

export default CounterOfferButtons;
