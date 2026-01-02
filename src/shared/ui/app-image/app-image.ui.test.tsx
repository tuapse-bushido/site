import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppImage } from './app-image';

describe('AppImage UI', (): void => {
  const src = 'https://example.com/image.jpg';
  const alt = 'Test Image';
  const imageProps = {
    width: 400,
    height: 400,
  };

  it('Рендерится без ошибок с указанием width & height', (): void => {
    render(<AppImage src={src} alt={alt} imageProps={imageProps} />);

    const img = screen.getByAltText(alt);
    expect(img).toBeInTheDocument();
  });

  it('Рендерится без ошибок без width & height, но с fill', (): void => {
    render(<AppImage src={src} alt={alt} imageProps={{ fill: true }} />);

    const img = screen.getByAltText(alt);
    expect(img).toBeInTheDocument();
  });

  it('Прокидывает классы root и image', (): void => {
    render(
      <AppImage
        src={src}
        alt={alt}
        imageProps={imageProps}
        classNames={{
          root: 'test-root',
          image: 'test-image',
        }}
      />,
    );

    const root = screen.getByRole('img').parentElement;
    const img = screen.getByAltText(alt);

    expect(root).toHaveClass('test-root');
    expect(img).toHaveClass('test-image');
  });

  it('прокидывает пропсы в root и image', (): void => {
    render(<AppImage src={src} alt={alt} rootProps={{ 'data-root-prop': '123' }} imageProps={imageProps} />);

    const root = screen.getByRole('img').parentElement;
    const img = screen.getByAltText(alt);

    expect(root).toHaveAttribute('data-root-prop', '123');
    expect(img).toHaveAttribute('height', '400');
  });
});
