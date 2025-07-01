import { CounterOffer } from "@/socket-server";
import React from "react";
import { TimeStamp } from "./TimeStamp";

export const CounterOfferMessageBlock = ({
  message,
}: {
  message: CounterOffer;
}) => {
  return (
    <div className="mt-[27px]">
      <p className="text-center text-gray-800">
        You received an offer of
        <span className="font-semibold">{message.amount}</span> for this item.
        <span className="text-sm text-gray-500">
          <TimeStamp timestamp={message.timestamp} />
        </span>
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-[24px]">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition">
          Accept Offer
        </button>
        <button className="px-4 py-2 bg-gray-100 border border-gray-400 rounded-md shadow-inner text-gray-800 font-medium hover:bg-gray-200 transition">
          Counter Offer
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition">
          Decline Offer
        </button>
      </div>
    </div>
  );
};
