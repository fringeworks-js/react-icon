import { render } from '@testing-library/react';
import { createRef } from 'react';
import SvgIconFrame from './SvgIconFrame';

describe('SvgIconFrame', () => {
  it('箱の span の中に、既定の viewBox・fill を付けた svg を描き、子要素を入れる', () => {
    const { container } = render(
      <SvgIconFrame>
        <path d="M0 0h24v24H0z" />
      </SvgIconFrame>,
    );
    const span = container.firstElementChild;
    expect(span?.tagName).toBe('SPAN');
    expect(span?.getAttribute('class')).toBe('frg-icon frg-svgicon');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
    const svg = span?.querySelector(':scope > svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.querySelector('path')).not.toBeNull();
  });

  it('viewBox・fill は svg に、それ以外の props は span に渡す（className は足す）', () => {
    const { container } = render(
      <SvgIconFrame
        viewBox="0 0 16 16"
        fill="none"
        className="mine"
        data-icon="logo"
      />,
    );
    const span = container.firstElementChild;
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(svg?.getAttribute('fill')).toBe('none');
    expect(span?.getAttribute('class')).toBe('frg-icon frg-svgicon mine');
    expect(span?.getAttribute('data-icon')).toBe('logo');
    expect(svg?.getAttribute('class')).toBeNull();
  });

  it('aria-label を渡すと、箱が画像として読み上げられる', () => {
    const { getByRole } = render(<SvgIconFrame aria-label="ロゴ" />);
    expect(getByRole('img', { name: 'ロゴ' }).tagName).toBe('SPAN');
  });

  it('ref は箱の span を指す', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<SvgIconFrame ref={ref} />);
    expect(ref.current?.tagName).toBe('SPAN');
  });
});
