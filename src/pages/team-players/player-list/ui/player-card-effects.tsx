import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";

declare global {
  interface Window {
    __hoverTiltDefinePromise?: Promise<void>;
  }
}

const ensureHoverTiltRegistered = async () => {
  if (typeof window === "undefined") return;
  if (customElements.get("hover-tilt")) return;

  if (!window.__hoverTiltDefinePromise) {
    window.__hoverTiltDefinePromise = import("hover-tilt/web-component")
      .then(() => undefined)
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : String(error ?? "");
        if (message.includes("has already been used")) return;
        throw error;
      });
  }

  await window.__hoverTiltDefinePromise;
};

interface PlayerCardTiltProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  tiltFactor?: number;
  scaleFactor?: number;
}

interface PlayerCardEffectsProps {
  clipPath: string;
}

export function PlayerCardTilt({
  children,
  className,
  width = 193,
  height = 302,
  tiltFactor = 1.35,
  scaleFactor = 1.05,
}: PlayerCardTiltProps) {
  useEffect(() => {
    void ensureHoverTiltRegistered();
  }, []);

  return (
    <div
      className={className}
      style={
        {
          "--pc-tilt-width": `${width}px`,
          "--pc-tilt-height": `${height}px`,
        } as CSSProperties
      }
    >
      <hover-tilt
        tilt-factor={tiltFactor}
        scale-factor={scaleFactor}
        glare-intensity={0}
        blend-mode="overlay"
        className="pc-tilt block"
      >
        {children}
      </hover-tilt>
    </div>
  );
}

export function PlayerCardEffects({ clipPath }: PlayerCardEffectsProps) {
  return (
    <>
      <div
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{
          background: "var(--nar-cardbg)",
          clipPath,
          WebkitClipPath: clipPath,
        }}
      />
      <div
        className="pc-v-overlay absolute inset-0 z-20 pointer-events-none"
        style={{
          clipPath,
          WebkitClipPath: clipPath,
        }}
      />
      <div
        className="pc-v-glare absolute inset-0 z-[21] pointer-events-none"
        style={{
          clipPath,
          WebkitClipPath: clipPath,
        }}
      />
    </>
  );
}
