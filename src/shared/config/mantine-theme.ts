import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  colors: {
    primary: [
      '#f0f4ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7',
    ],
  },
  components: {
    SegmentedControl: {
      styles: () => ({
        root: {
          backgroundColor: 'var(--mantine-color-default)',
        },
        label: {
          color: 'var(--mantine-color-text)',
        },
      }),
    },
  },
});
