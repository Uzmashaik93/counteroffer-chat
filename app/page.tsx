import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-row ml-2 mt-10 gap-4">
        <Link
          href="/chat/buyer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-gray-800 bg-black text-white px-2 py-2"
        >
          Buyer Chat
        </Link>

        <Link
          href="/chat/seller"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-gray-800 bg-black text-white px-2 py-2"
        >
          Seller Chat
        </Link>
        <Link
          href="/login"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-gray-800 bg-black text-white px-2 py-2"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
