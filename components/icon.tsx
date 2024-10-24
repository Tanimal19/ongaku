import { cn } from "@/lib/utils";

interface IconProps {
  id: string;
  className?: string;
}

export default function Icon({ id, className, ...props }: IconProps) {
  return (
    <svg
      className={cn("w-6 h-6 fill-zinc-950", className)}
      width={20}
      height={20}
      {...props}
    >
      <use href={`/sprite.svg#${id}`}></use>
    </svg>
  );
}
