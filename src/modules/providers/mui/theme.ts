import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  spacing: 5,

  typography: {
    htmlFontSize: 10,
    fontFamily: 'var(--font-roboto), Roboto, Arial, sans-serif',
    fontSize: 14,

    h1: {
      fontSize: '3.2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2.4rem',
      fontWeight: 600,
    },

    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1.4rem',
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '2.4rem',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 56,
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
        },
      },
    },
  },
});
