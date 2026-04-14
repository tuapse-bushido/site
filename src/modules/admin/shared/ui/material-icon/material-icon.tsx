import { Box, SxProps, Theme } from '@mui/material';
import { JSX } from 'react';

type NameIcons = 'menu_book_2';

type IconProps = {
  name: NameIcons;
  filled?: boolean;
  sx?: SxProps<Theme>;
};

export const MaterialIcon = ({ name, filled = false, sx }: IconProps): JSX.Element => {
  return (
    <Box
      component="span"
      className="material-symbols-outlined" // Наш класс из globals.css
      sx={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' 24`,
        fontSize: '2.4rem',
        lineHeight: 1,
        display: 'inline-block',
        verticalAlign: 'middle',
        userSelect: 'none',
        ...sx,
      }}
    >
      {name}
    </Box>
  );
};
