import React from "react";
import { TimeStamp } from "./TimeStamp";

const CounterOfferMessageLine = ({
  amount,
  timestamp,
  action,
}: {
  amount: number;
  timestamp: string;
  action: string;
}) => {
  return (
    <p className="text-center text-sm text-gray-800">
      You {action} a counter offer of
      <span className="font-semibold"> {amount} EUR </span>
      for this item.
      <span className="text-xs text-gray-500 px-2 ">
        <TimeStamp timestamp={timestamp} />
      </span>
    </p>
  );
};

export default CounterOfferMessageLine;
