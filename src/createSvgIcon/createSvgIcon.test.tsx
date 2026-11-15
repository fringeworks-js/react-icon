import { render } from '@testing-library/react';
import { createRef, type SVGProps } from 'react';
import createSvgIcon from './createSvgIcon';

// 線で描くアイコン（lucide-react などと同じく、fill="none" の属性を付ける）
function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      data-icon="home"
      {...props}
    >
      <path d="M3 10l9-7 9 7v11H3z" />
    </svg>
  );
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" data-icon="menu" />;
}

describe('createSvgIcon', () => {
  const Icon = createSvgIcon({ home: HomeIcon, menu: MenuIcon });

  it('value の名前に対応する部品を、クラスを付けた箱の span の中に描く', () => {
    const { container } = render(<Icon value="home" />);
    const span = container.firstElementChild;
    expect(span?.tagName).toBe('SPAN');
    expect(span?.getAttribute('class')).toBe('frg-icon frg-svgicon');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
    expect(span?.querySelector(':scope > svg')?.getAttribute('data-icon')).toBe(
      'home',
    );
  });

  it('部品の fill などの属性は、そのまま使う', () => {
    const { container } = render(<Icon value="home" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('fill')).toBe('none');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
    expect(svg?.getAttribute('class')).toBeNull();
  });

  it('その他の props を箱の span に渡す', () => {
    const ref = createRef<HTMLSpanElement>();
    const { getByRole } = render(
      <Icon value="menu" aria-label="メニュー" className="mine" ref={ref} />,
    );
    const span = getByRole('img', { name: 'メニュー' });
    expect(span.tagName).toBe('SPAN');
    expect(span.getAttribute('class')).toBe('frg-icon frg-svgicon mine');
    expect(span.querySelector('svg')?.getAttribute('data-icon')).toBe('menu');
    expect(ref.current).toBe(span);
  });

  it('対応表に無い名前は、空の箱を描く（Object.prototype のプロパティも拾わない）', () => {
    const LooseIcon = createSvgIcon<string>({ home: HomeIcon });
    for (const value of ['unknown', 'toString']) {
      const { container, unmount } = render(<LooseIcon value={value} />);
      const span = container.firstElementChild;
      expect(span?.getAttribute('class')).toBe('frg-icon frg-svgicon');
      const svg = span?.querySelector('svg');
      expect(svg?.getAttribute('data-icon')).toBeNull();
      expect(svg?.childElementCount).toBe(0);
      unmount();
    }
  });

  it('名前の型は対応表のキーから決まる', () => {
    // @ts-expect-error 対応表に無い名前
    void (<Icon value="close" />);
  });
});
