import About from "@/components/about";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="bg-zinc-50 w-full h-12 py-2 px-6 flex flex-row justify-between items-center border-b">
        <Link href="/">
          <Image src="/logo-full.svg" width={120} height={40} alt="logo" />
        </Link>
      </div>
      <About />
    </div>
  );
}
