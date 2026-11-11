import { render } from '@testing-library/react';
import { createRef } from 'react';
import SvgIconFrame from './SvgIconFrame';

describe('SvgIconFrame', () => {
  it('子要素を、クラスと既定の viewBox・fill を付けた svg に描く', () => {
    const { container } = render(
      <SvgIconFrame>
        <path d="M0 0h24v24H0z" />
      </SvgIconFrame>,
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toBe('frg-icon frg-svgicon');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.querySelector('path')).not.toBeNull();
  });

  it('受け取った props を優先する（className は足す）', () => {
    const { container } = render(
      <SvgIconFrame viewBox="0 0 16 16" fill="none" className="mine" />,
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(svg?.getAttribute('fill')).toBe('none');
    expect(svg?.getAttribute('class')).toBe('frg-icon frg-svgicon mine');
  });

  it('aria-label を渡すと画像として読み上げられる', () => {
    const { getByRole } = render(<SvgIconFrame aria-label="ロゴ" />);
    expect(getByRole('img', { name: 'ロゴ' }).tagName).toBe('svg');
  });

  it('ref は svg を指す', () => {
    const ref = createRef<SVGSVGElement>();
    render(<SvgIconFrame ref={ref} />);
    expect(ref.current?.tagName).toBe('svg');
  });
});
