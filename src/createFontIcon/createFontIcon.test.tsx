import { render } from '@testing-library/react';
import { createRef } from 'react';
import createFontIcon from './createFontIcon';

describe('createFontIcon', () => {
  const Icon = createFontIcon<'home' | 'menu'>({
    fontFamily: 'Material Symbols Outlined',
  });

  it('value の名前を、クラスと font-family を付けた span に描く', () => {
    const { container } = render(<Icon value="home" />);
    const span = container.querySelector('span');
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe('home');
    expect(span?.className).toBe('frg-icon frg-fonticon');
    // 空白を含むファミリー名は、引用符で囲んで出力される
    expect(span?.style.fontFamily).toBe('"Material Symbols Outlined"');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
  });

  it('aria-label を渡すと画像として読み上げられる', () => {
    const { getByRole } = render(<Icon value="home" aria-label="ホーム" />);
    expect(getByRole('img', { name: 'ホーム' }).textContent).toBe('home');
  });

  it('ref は span を指す', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon value="home" ref={ref} />);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('クラスで描くセットは文字を入れずにクラスを付ける', () => {
    const FontAwesome = createFontIcon<'house'>({
      className: (name) => `fa-solid fa-${name}`,
      text: 'none',
    });
    const { container } = render(<FontAwesome value="house" />);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('');
    expect(span?.className).toBe('frg-icon frg-fonticon fa-solid fa-house');
  });

  it('対応表の text から名前の型が決まる', () => {
    const MyIcon = createFontIcon({
      fontFamily: 'MyIcons',
      text: { home: '\ue900' },
    });
    const { container } = render(<MyIcon value="home" />);
    expect(container.textContent).toBe('\ue900');
    // @ts-expect-error 対応表に無い名前
    void (<MyIcon value="menu" />);
  });

  describe('webFonts', () => {
    it('定義の fontFamily などから作る', () => {
      const WeightedIcon = createFontIcon({
        fontFamily: 'Icons',
        fontWeight: 900,
        fontStyle: 'normal',
      });
      expect(Icon.webFonts).toEqual([{ family: 'Material Symbols Outlined' }]);
      expect(WeightedIcon.webFonts).toEqual([
        { family: 'Icons', weight: 900, style: 'normal' },
      ]);
    });

    it('fontFamily が無ければ空の配列', () => {
      expect(createFontIcon({ className: 'icons' }).webFonts).toEqual([]);
    });
  });

  it('displayName に font-family を入れる', () => {
    expect(Icon.displayName).toBe('FontIcon(Material Symbols Outlined)');
    expect(createFontIcon({}).displayName).toBe('FontIcon');
  });
});
