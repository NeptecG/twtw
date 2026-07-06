"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const safe = photos.length ? photos : ["/next.svg"];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const go = (dir: number) => setIndex((i) => (i + dir + safe.length) % safe.length);

  return (
    <div>
      <div className="group relative aspect-[3/2] overflow-hidden rounded-3xl bg-muted">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0 z-[1] cursor-zoom-in"
          aria-label="Open gallery"
        />
        <Image
          src={safe[index]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <span className="pointer-events-none absolute right-4 top-4 z-[2] inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Expand className="h-3.5 w-3.5" />
          {index + 1} / {safe.length}
        </span>
        {safe.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-[2] inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-[2] inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition hover:bg-background"
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
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <GalleryLightbox
          photos={safe}
          title={alt}
          start={index}
          onClose={(final) => {
            setIndex(final);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

function GalleryLightbox({
  photos,
  title,
  start,
  onClose,
}: {
  photos: string[];
  title: string;
  start: number;
  onClose: (finalIndex: number) => void;
}) {
  const n = photos.length;
  const wrap = (i: number) => ((i % n) + n) % n;

  const [idx, setIdx] = useState(start);
  const [drag, setDrag] = useState(0);
  const [anim, setAnim] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(0);
  const movedRef = useRef(false);
  const activeRef = useRef(false);
  const animRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const idxRef = useRef(start);
  idxRef.current = idx;

  const stageWidth = () => stageRef.current?.clientWidth || window.innerWidth;

  // Commit the slide after the track animation finishes (timer-driven, robust).
  const go = useCallback(
    (delta: number) => {
      if (animRef.current || n < 2) return;
      const w = stageWidth();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      animRef.current = true;
      setAnim(true);
      const target = delta === 1 ? -w : w; // next slides track left, prev right
      dragRef.current = target;
      setDrag(target);
      timerRef.current = window.setTimeout(() => {
        setIdx((i) => ((i + delta) % n + n) % n);
        dragRef.current = 0;
        animRef.current = false;
        setDrag(0);
        setAnim(false);
      }, reduce ? 40 : 440);
    },
    [n],
  );

  const snapBack = () => {
    if (dragRef.current === 0) return;
    animRef.current = true;
    setAnim(true);
    dragRef.current = 0;
    setDrag(0);
    timerRef.current = window.setTimeout(() => {
      animRef.current = false;
      setAnim(false);
    }, 440);
  };

  // Body scroll lock + keyboard control
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(idxRef.current);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [go, onClose]);

  function onPointerDown(e: React.PointerEvent) {
    if (animRef.current || n < 2) return;
    activeRef.current = true;
    movedRef.current = false;
    dragRef.current = 0;
    stageRef.current?.setPointerCapture?.(e.pointerId);
    (e.currentTarget as HTMLElement).dataset.x0 = String(e.clientX);
    setAnim(false);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!activeRef.current) return;
    const x0 = Number((e.currentTarget as HTMLElement).dataset.x0 || 0);
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 4) movedRef.current = true;
    dragRef.current = dx;
    setDrag(dx);
  }
  function onPointerUp() {
    if (!activeRef.current) return;
    activeRef.current = false;
    const w = stageWidth();
    const threshold = Math.min(70, w * 0.16);
    const dx = dragRef.current;
    if (dx <= -threshold) go(1);
    else if (dx >= threshold) go(-1);
    else snapBack();
  }
  function onStageClick() {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    onClose(idxRef.current);
  }

  const slides = [wrap(idx - 1), idx, wrap(idx + 1)];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(15, 35, 28, 0.94)", backdropFilter: "blur(6px)" }}
    >
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onStageClick}
        className="absolute inset-0 overflow-hidden"
        style={{ touchAction: "pan-y", cursor: n > 1 ? "grab" : "default" }}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(calc(-100% + ${drag}px))`,
            transition: anim ? `transform 0.42s ${EASE}` : "none",
          }}
        >
          {slides.map((pi, k) => (
            <div
              key={k}
              className="flex h-full w-full shrink-0 items-center justify-center px-[5vw] py-[8vh]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[pi]}
                alt={k === 1 ? title : ""}
                draggable={false}
                className="max-h-[78vh] max-w-[90vw] rounded-lg object-contain shadow-[0_30px_80px_rgba(0,0,0,0.55)] select-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="pointer-events-none absolute left-0 right-0 top-[clamp(1rem,4vh,2.2rem)] text-center text-[0.8rem] font-medium tracking-[0.22em] text-[#e6f3de] [font-variant-numeric:tabular-nums] [text-shadow:0_1px_6px_rgba(0,0,0,0.65)]">
        {idx + 1} / {n}
      </div>

      {/* Caption / title */}
      <div className="pointer-events-none absolute bottom-[clamp(1.2rem,5vh,2.6rem)] left-0 right-0 px-6 text-center font-display text-[clamp(1rem,2.4vw,1.35rem)] italic text-[#e6f3de] [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
        {title}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose(idx);
        }}
        aria-label="Close"
        className="absolute right-[clamp(1rem,4vw,1.8rem)] top-[clamp(1rem,3.5vh,1.6rem)] z-[2] flex h-12 w-12 items-center justify-center rounded-full border border-[#e6f3de]/25 bg-[#e6f3de]/10 text-[#e6f3de] backdrop-blur transition-colors hover:border-terracotta hover:bg-terracotta"
      >
        <X className="h-5 w-5" />
      </button>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
            className="absolute left-[clamp(0.8rem,3vw,1.8rem)] top-1/2 z-[2] hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6f3de]/25 bg-[#e6f3de]/10 text-[#e6f3de] backdrop-blur transition-colors hover:border-terracotta hover:bg-terracotta sm:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
            className="absolute right-[clamp(0.8rem,3vw,1.8rem)] top-1/2 z-[2] hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6f3de]/25 bg-[#e6f3de]/10 text-[#e6f3de] backdrop-blur transition-colors hover:border-terracotta hover:bg-terracotta sm:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}
