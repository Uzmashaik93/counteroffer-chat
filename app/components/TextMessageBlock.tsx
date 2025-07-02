import { RegularMessage } from "@/socket-server";
import { TimeStamp } from "./TimeStamp";

export const TextMessageBlock = ({
  isOwnMessage,
  message,
}: {
  isOwnMessage: boolean;
  message: RegularMessage;
}) => {
  return (
    <div
      className={`flex flex-col items-${isOwnMessage ? "end" : "start"} mb-2`}
    >
      <div className="flex items-end gap-2">
        {!isOwnMessage && (
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        )}
        <div
          className={`rounded-xl p-3 text-sm max-w-xs shadow ${
            isOwnMessage ? "bg-white text-black" : "bg-white text-gray-900"
          }`}
        >
          {message.message}
          <div className="mt-1 text-xs text-gray-500">
            <TimeStamp timestamp={message.timestamp} />
          </div>
        </div>
      </div>
    </div>
  );
};
