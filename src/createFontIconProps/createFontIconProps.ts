import { mergeProps } from '@fringeworks/react-merge';
import { hasOwn } from '@fringeworks/utils/object/hasOwn';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import createIconAriaProps from '../_internal/_createIconAriaProps';
import type { FontIconDefinition, FontIconProps, FontIconText } from './types';

/**
 * フォントのアイコンの要素（`<span>` など）に渡す props を作る\
 * クラス（`frg-icon frg-fonticon` と定義のクラス）、定義の `font-family` などの style、アイコンの文字、
 * 読み上げの props（名前が無ければ `aria-hidden`、あれば `role="img"`）を作り、受け取った props を後に重ねる。
 * `className`・`style` は合成し、同じプロパティは受け取った値を優先する
 * @param definition フォントのアイコンのセットの定義
 * @param props 要素が受け取った props
 * @returns 要素に渡す props
 */
export default function createFontIconProps<V extends string>(
  definition: FontIconDefinition<V>,
  props: FontIconProps<V>,
): ComponentPropsWithRef<'span'> {
  const { fontFamily, fontWeight, fontStyle, className, text } = definition;
  const { value, ...rest } = props;
  const style: CSSProperties = { fontFamily, fontWeight, fontStyle };

  return mergeProps<ComponentPropsWithRef<'span'>, HTMLSpanElement>(
    createIconAriaProps(rest),
    {
      className: [
        'frg-icon frg-fonticon',
        typeof className === 'function' ? className(value) : className,
      ],
      style,
      children: _resolveText(text, value),
    },
    rest,
  );
}

/**
 * 定義の text から、要素の文字を決める
 */
function _resolveText<V extends string>(
  text: FontIconText<V> = 'name',
  value: V,
): string | undefined {
  if (text === 'name') {
    return value;
  }
  if (text === 'none') {
    return undefined;
  }
  if (typeof text === 'function') {
    return text(value);
  }
  // Object.prototype のプロパティ（toString など）を拾わない
  return hasOwn(text, value) ? text[value] : undefined;
}
