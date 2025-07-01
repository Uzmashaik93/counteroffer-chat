import { RegularMessage } from "@/socket-server";

export const TextMessageBlock = ({
  isOwnMessage,
  message,
}: {
  isOwnMessage: boolean;
  message: RegularMessage;
}) => {
  return (
    <div
      className={`flex items-start gap-2 ${isOwnMessage ? "justify-end" : ""}`}
    >
      {!isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      )}

      <div
        className={`rounded-xl p-3 text-sm max-w-xs shadow ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-white text-gray-900"
        }`}
      >
        {message.message}
      </div>
    </div>
  );
};
