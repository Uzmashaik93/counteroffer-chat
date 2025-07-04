import { useState } from "react";

export const OfferBlock = ({
  sendOffer,
}: {
  sendOffer: (amount: number) => void;
}) => {
  const [offerAmount, setOfferAmount] = useState("");

  return (
    <div className="mt-[27px]">
      <div className="flex flex-wrap gap-3 justify-center mt-[24px]">
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
      </div>
    </div>
  );
};
