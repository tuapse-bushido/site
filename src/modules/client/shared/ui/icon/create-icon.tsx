import { ComponentType, JSX, SVGProps } from 'react';

export const createIcon = (Svg: ComponentType<SVGProps<SVGSVGElement>>): ComponentType<SVGProps<SVGSVGElement>> => {
  const Icon = ({ width = 20, height = 20, ...props }: SVGProps<SVGSVGElement>): JSX.Element => (
    <Svg width={width} height={height} aria-hidden focusable={false} {...props} />
  );

  Icon.displayName = `Icon(${Svg.displayName || Svg.name || 'Svg'})`;

  return Icon;
};
