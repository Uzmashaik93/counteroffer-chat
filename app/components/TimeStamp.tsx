import { useEffect, useState } from "react";

export const TimeStamp = ({ timestamp }: { timestamp: string }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const getTimeAgo = (date: Date): string => {
      const seconds = Math.floor(
        (new Date().getTime() - date.getTime()) / 1000
      );
      const intervals: [string, number][] = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1],
      ];

      for (const [unit, value] of intervals) {
        const amount = Math.floor(seconds / value);
        if (amount >= 1) {
          return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
        }
      }
      return "just now";
    };

    const date = new Date(timestamp);
    setTimeAgo(getTimeAgo(date));
  }, [timestamp]);
  return <span className="text-xs text-gray-500">{timeAgo}</span>;
};
