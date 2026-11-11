import { render } from '@testing-library/react';
import { createRef } from 'react';
import createSvgIcon from './createSvgIcon';
import type { SvgIconSlotProps } from './types';

// 線で描くアイコン（lucide-react などと同じく、fill="none" の属性を付ける）
function HomeIcon(props: SvgIconSlotProps) {
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

function MenuIcon(props: SvgIconSlotProps) {
  return <svg viewBox="0 0 24 24" data-icon="menu" {...props} />;
}

describe('createSvgIcon', () => {
  const Icon = createSvgIcon({ home: HomeIcon, menu: MenuIcon });

  it('value の名前に対応する部品を、クラスを付けて描く', () => {
    const { container } = render(<Icon value="home" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('data-icon')).toBe('home');
    expect(svg?.getAttribute('class')).toBe('frg-icon frg-svgicon');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('部品の fill などの属性は、そのまま使う', () => {
    const { container } = render(<Icon value="home" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('fill')).toBe('none');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
  });

  it('その他の props を部品に渡す', () => {
    const ref = createRef<SVGSVGElement>();
    const { getByRole } = render(
      <Icon value="menu" aria-label="メニュー" className="mine" ref={ref} />,
    );
    const svg = getByRole('img', { name: 'メニュー' });
    expect(svg.getAttribute('data-icon')).toBe('menu');
    expect(svg.getAttribute('class')).toBe('frg-icon frg-svgicon mine');
    expect(ref.current).toBe(svg);
  });

  it('対応表に無い名前は、空の箱を描く（Object.prototype のプロパティも拾わない）', () => {
    const LooseIcon = createSvgIcon<string>({ home: HomeIcon });
    for (const value of ['unknown', 'toString']) {
      const { container, unmount } = render(<LooseIcon value={value} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('class')).toBe('frg-icon frg-svgicon');
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
