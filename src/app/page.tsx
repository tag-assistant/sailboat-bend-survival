"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    import("../game/engine").then((mod) => {
      if (containerRef.current) mod.startGame(containerRef.current);
    });
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
