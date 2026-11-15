import { render } from '@testing-library/react';
import { createRef } from 'react';
import createSpriteIcon from './createSpriteIcon';

describe('createSpriteIcon', () => {
  it('ファイルの URL と名前から href を作り、use で描く', () => {
    const Icon = createSpriteIcon<'home' | 'menu'>({ href: '/icons.svg' });
    const { container } = render(<Icon value="home" />);
    const span = container.firstElementChild;
    expect(span?.getAttribute('class')).toBe('frg-icon frg-svgicon');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.querySelector('use')?.getAttribute('href')).toBe(
      '/icons.svg#home',
    );
  });

  it("'' はページの中の symbol を参照する", () => {
    const Icon = createSpriteIcon<'home'>({ href: '' });
    const { container } = render(<Icon value="home" />);
    expect(container.querySelector('use')?.getAttribute('href')).toBe('#home');
  });

  it('関数は名前から href を作る', () => {
    const Icon = createSpriteIcon<'home'>({
      href: (name) => `/icons.svg#icon-${name}`,
    });
    const { container } = render(<Icon value="home" />);
    expect(container.querySelector('use')?.getAttribute('href')).toBe(
      '/icons.svg#icon-home',
    );
  });

  it('その他の props を箱の span に渡す', () => {
    const Icon = createSpriteIcon<'cart'>({ href: '/icons.svg' });
    const ref = createRef<HTMLSpanElement>();
    const { getByRole } = render(
      <Icon value="cart" aria-label="カート" className="mine" ref={ref} />,
    );
    const span = getByRole('img', { name: 'カート' });
    expect(span.tagName).toBe('SPAN');
    expect(span.getAttribute('class')).toBe('frg-icon frg-svgicon mine');
    expect(ref.current).toBe(span);
  });

  it('名前の型は型引数で決まる', () => {
    const Icon = createSpriteIcon<'home'>({ href: '/icons.svg' });
    // @ts-expect-error 型引数に無い名前
    void (<Icon value="menu" />);
  });
});
