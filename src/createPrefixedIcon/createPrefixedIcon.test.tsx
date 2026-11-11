import { render } from '@testing-library/react';
import createFontIcon from '../createFontIcon';
import createSpriteIcon from '../createSpriteIcon';
import createSvgIcon, { type SvgIconSlotProps } from '../createSvgIcon';
import createPrefixedIcon from './createPrefixedIcon';

function LogoIcon(props: SvgIconSlotProps) {
  return <svg data-icon="logo" {...props} />;
}

describe('createPrefixedIcon', () => {
  const Icon = createPrefixedIcon({
    ms: createFontIcon<'home' | 'menu'>({ fontFamily: 'Symbols' }),
    sprite: createSpriteIcon<'cart'>({ href: '/icons.svg' }),
    svg: createSvgIcon({ logo: LogoIcon }),
  });

  it('接頭辞の部品に、名前を渡して描く', () => {
    const { container } = render(
      <>
        <Icon value="ms:home" />
        <Icon value="sprite:cart" />
        <Icon value="svg:logo" />
      </>,
    );
    expect(container.querySelector('span')?.textContent).toBe('home');
    expect(container.querySelector('use')?.getAttribute('href')).toBe(
      '/icons.svg#cart',
    );
    expect(
      container.querySelector('[data-icon="logo"]')?.getAttribute('class'),
    ).toBe('frg-icon frg-svgicon');
  });

  it('その他の props を部品に渡す', () => {
    const { getByRole } = render(
      <Icon value="ms:menu" aria-label="メニュー" className="mine" />,
    );
    const span = getByRole('img', { name: 'メニュー' });
    expect(span.textContent).toBe('menu');
    expect(span.className).toBe('frg-icon frg-fonticon mine');
  });

  it('名前は最初の : で分ける', () => {
    const Loose = createPrefixedIcon({ ms: createFontIcon<string>({}) });
    const { container } = render(<Loose value="ms:a:b" />);
    expect(container.querySelector('span')?.textContent).toBe('a:b');
  });

  it('対応表に無い接頭辞や : の無い値は、空の箱を描く', () => {
    const Loose = createPrefixedIcon({ ms: createFontIcon<string>({}) });
    for (const value of ['other:home', 'home', 'toString:home']) {
      const { container, unmount } = render(
        <Loose value={value as 'ms:home'} className="mine" />,
      );
      const span = container.querySelector('span');
      expect(span?.className).toBe('frg-icon mine');
      expect(span?.textContent).toBe('');
      expect(span?.getAttribute('aria-hidden')).toBe('true');
      unmount();
    }
  });

  it('空の箱も、aria-label があれば画像として読み上げられる', () => {
    const Loose = createPrefixedIcon({ ms: createFontIcon<string>({}) });
    const { getByRole } = render(
      <Loose value={'home' as 'ms:home'} aria-label="ホーム" />,
    );
    expect(getByRole('img', { name: 'ホーム' }).tagName).toBe('SPAN');
  });

  it('value の型は接頭辞と各部品の名前から決まる', () => {
    void (<Icon value="sprite:cart" />);
    // @ts-expect-error 部品に無い名前
    void (<Icon value="ms:cart" />);
    // @ts-expect-error 対応表に無い接頭辞
    void (<Icon value="fa:home" />);
  });
});
