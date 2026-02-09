import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  components: {
    SegmentedControl: {
      styles: () => ({
        root: {
          backgroundColor: "var(--nar-navchip-bg-default)",
          border: "1px solid var(--nar-navchip-bg-line)",
          borderRadius: "10px",
          boxShadow: "none",
        },
        label: {
          color: "var(--nar-text-tertiary-sub)",
          '&[data-active="true"]': {
            color: "var(--nar-text-secondary)",
          },
        },
        indicator: {
          backgroundColor: "var(--nar-navchip-bg-pressed)",
          boxShadow: "none",
          borderRadius: "10px",
        },
      }),
    },
  },
});
