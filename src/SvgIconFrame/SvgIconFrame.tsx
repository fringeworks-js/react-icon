import { mergeProps } from '@fringeworks/react-merge';
import type { ComponentPropsWithRef } from 'react';
import createIconAriaProps from '../_internal/_createIconAriaProps';
import type { SvgIconFrameProps } from './types';

/**
 * 1つの SVG（`<path>` などの子要素）を、アイコンの箱と読み上げの扱いで描く部品\
 * アイコンの箱の `<span>` の中に `<svg>` を描く（箱で、周りの文字とそろえる位置を決めるため）。
 * `viewBox`（既定は `'0 0 24 24'`）・`fill`（既定は `'currentColor'`。文字の色で塗る）・`children` は `<svg>` に、
 * それ以外の props は `<span>` に渡す（`className`・`style` は合成し、同じプロパティは受け取った値を優先する）
 *
 * - `aria-label`・`aria-labelledby` が無ければ飾りとして `aria-hidden` を付け、あれば `role="img"` を付ける
 * - 見た目には `@fringeworks/react-icon/styles.css` が要る
 */
export default function SvgIconFrame(props: SvgIconFrameProps) {
  const {
    viewBox = '0 0 24 24',
    fill = 'currentColor',
    children,
    ...rest
  } = props;
  return (
    <span
      {...mergeProps<ComponentPropsWithRef<'span'>, HTMLSpanElement>(
        createIconAriaProps(rest),
        { className: 'frg-icon frg-svgicon' },
        rest,
      )}
    >
      <svg viewBox={viewBox} fill={fill}>
        {children}
      </svg>
    </span>
  );
}
