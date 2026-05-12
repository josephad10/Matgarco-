import Image from "next/image";
import { cn } from "@/lib/utils";

interface MatgarcoImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide" | "auto";
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

export default function MatgarcoImage({
  src,
  alt,
  className,
  imageClassName,
  aspectRatio = "auto",
  priority = false,
  objectFit = "cover",
}: MatgarcoImageProps) {
  // تحديد النسبة بين الطول والعرض للبرواز
  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[4/5]",
    wide: "aspect-[16/9]",
    auto: "", // No fixed aspect ratio, allows natural scaling
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-100", 
        aspectRatios[aspectRatio],
        className,
      )}
    >
      {aspectRatio === "auto" ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-auto block transition-transform duration-700 ease-in-out group-hover:scale-105",
            objectFit === "contain" ? "object-contain" : "object-cover",
            imageClassName
          )}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "transition-transform duration-700 ease-in-out group-hover:scale-105",
            objectFit === "contain" ? "object-contain" : "object-cover",
            imageClassName
          )}
        />
      )}
    </div>
  );
}
