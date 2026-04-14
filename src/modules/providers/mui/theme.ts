import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  spacing: 5,

  typography: {
    htmlFontSize: 10, // Правильно, это говорит MUI, что 1rem = 10px
    fontFamily: 'var(--font-roboto), Roboto, Arial, sans-serif',
    fontSize: 14, // Базовый текст 14px

    h1: {
      fontSize: '3.2rem', // Теперь это будет ровно 32px
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.8rem', // 28px
      fontWeight: 600,
    },
    h3: {
      fontSize: '2.4rem', // 24px
      fontWeight: 600,
    },

    // MUI по умолчанию использует rem. Если не задать эти значения,
    // он возьмет свои дефолты (6rem для h1), что при базе 10px и даст огромные буквы.

    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1.4rem', // Явно задаем 14px для кнопок
    },
  },

  // Стандартные брейкпоинты (оставляем как есть)
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
        size: 'small',
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
