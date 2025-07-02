import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-row ml-2 mt-10 gap-4 justify-center items-center">
        <Link
          href="/login"
          className="hover:bg-gray-800 bg-black text-white px-2 py-2"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
