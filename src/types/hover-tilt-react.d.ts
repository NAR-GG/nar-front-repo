import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hover-tilt": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "tilt-factor"?: number | string;
        "tilt-factor-y"?: number | string;
        "scale-factor"?: number | string;
        "enter-delay"?: number | string;
        "exit-delay"?: number | string;
        "glare-intensity"?: number | string;
        "glare-hue"?: number | string;
        "blend-mode"?: string;
        "glare-mask"?: string;
        "glare-mask-mode"?: "match-source" | "luminance" | "alpha" | "none";
        "glare-mask-composite"?: "add" | "subtract" | "exclude" | "intersect";
        shadow?: boolean | "" | "true" | "false";
      };
    }
  }
}

export {};
