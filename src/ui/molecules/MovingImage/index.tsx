"use client";

import React from "react";

import "./styles.css";

import { useMotionValue } from "framer-motion";
import { useRef } from "react";

import Link from "next/link";

import { FramerImage } from "@/atoms/hocs";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface MovingImageProps {
  title: string;
  img: string;
  link: string;
}

export const MovingImage = ({
  title,
  img,
  link,
}: MovingImageProps): React.JSX.Element => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouse = (event: React.MouseEvent): void => {
    if (shouldReduceMotion) return;
    imgRef.current!.style.display = "inline-block";
    x.set(event.pageX - 100);
    y.set(-10);
  };

  const handleMouseLeave = (): void => {
    if (shouldReduceMotion) return;
    imgRef.current!.style.display = "none";
    x.set(0);
    y.set(0);
  };

  return (
    <Link
      href={link}
      target="_blank"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="moving-image__link">{title}</h2>

      <FramerImage
        ref={imgRef}
        src={img}
        alt={title}
        className="moving-image__frame"
        style={
          shouldReduceMotion
            ? undefined
            : ({ x, y } as unknown as React.CSSProperties)
        }
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, transition: { duration: 0.2 } }
        }
      />
    </Link>
  );
};
