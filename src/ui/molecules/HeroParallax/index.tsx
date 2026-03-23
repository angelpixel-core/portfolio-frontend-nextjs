"use client";

import React, { useEffect, useState } from "react";

import "./styles.css";

import Hero from "@/molecules/Hero";

interface HeroParallaxProps {
  name?: string;
  size: number;
  sizes?: string;
  className: string;
  imageSrc?: string;
}

const HeroParallax = ({
  name,
  size,
  sizes,
  className,
  imageSrc,
}: HeroParallaxProps): React.JSX.Element => {
  const [isParallaxReady, setIsParallaxReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadParallax = async () => {
      try {
        await import("@react-spring/parallax");
        if (isMounted) {
          setIsParallaxReady(true);
        }
      } catch (error) {
        if (isMounted) {
          setIsParallaxReady(false);
        }
      }
    };

    loadParallax();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="hero-parallax"
      data-parallax-ready={isParallaxReady ? "true" : "false"}
    >
      <Hero
        name={name}
        size={size}
        sizes={sizes}
        className={className}
        imageSrc={imageSrc}
      />
    </div>
  );
};

export default HeroParallax;
