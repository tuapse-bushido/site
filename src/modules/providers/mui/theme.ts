import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // m: 1 = 5px, m: 2 = 10px. Идеально для быстрой верстки.
  spacing: 5,

  typography: {
    // 10px в HTML — критически важно указать это здесь
    htmlFontSize: 10,

    // По умолчанию ставим Inter (переменная из твоего импорта)
    fontFamily: 'var(--font-inter), var(--font-roboto), Arial, sans-serif',

    // Настройка базового размера текста (1.4rem = 14px при базе 10px)
    fontSize: 14,

    button: {
      textTransform: 'none',
      fontWeight: 500,
    },

    // Можно точечно переопределить заголовки, если нужно
    h1: { fontWeight: 700 },
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
          borderRadius: '6px', // Аккуратные кнопки
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          // Компенсируем 10px в HTML, чтобы иконки не были мелкими
          fontSize: '2.4rem',
        },
      },
    },
    // Удобная настройка для инпутов, чтобы они не были слишком высокими
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
  },
});
