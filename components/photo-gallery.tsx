"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const safe = photos.length ? photos : ["/next.svg"];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + safe.length) % safe.length);

  return (
    <div>
      <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl bg-muted">
        <Image
          src={safe[index]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          aria-label="Expand"
        >
          <Expand className="h-4 w-4" />
        </button>
        {safe.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {safe.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {safe.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl ring-2 transition",
                i === index ? "ring-sea" : "ring-transparent hover:ring-border",
              )}
              aria-label={`Photo ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
            <Image src={safe[index]} alt={alt} fill sizes="90vw" className="object-contain" />
          </div>
          {safe.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-background">
                {index + 1} / {safe.length}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
