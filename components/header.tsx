import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";
import SearchDialog from "@/components/player/search-dialog";

export default function Header() {
  return (
    <div className="bg-zinc-50 w-full h-12 py-2 px-6 flex flex-row justify-between items-center border-b">
      <Link href="/">
        <Image src="/logo-full.svg" width={120} height={40} alt="logo" />
      </Link>
      <div className="flex flex-row items-center gap-4">
        <SearchDialog />
        <Link href="/about">
          <Icon id="help" className="h-8 w-8 p-1 rounded-sm hover:bg-muted" />
        </Link>
      </div>
    </div>
  );
}
