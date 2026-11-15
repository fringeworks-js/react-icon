import type { ComponentPropsWithRef, ReactNode, SVGProps } from 'react';

/**
 * `SvgIconFrame` のプロパティ\
 * `viewBox`・`fill`・`children` は `<svg>` に、それ以外（`className`・`style`・`aria-*`・`ref` など）は
 * アイコンの箱の `<span>` に渡す
 */
export type SvgIconFrameProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children'
> &
  Pick<SVGProps<SVGSVGElement>, 'viewBox' | 'fill'> & {
    /**
     * `<svg>` の子要素（`<path>` など）
     */
    children?: ReactNode;
  };
