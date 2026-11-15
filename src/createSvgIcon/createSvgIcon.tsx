import { mergeProps } from '@fringeworks/react-merge';
import { hasOwn } from '@fringeworks/utils/object/hasOwn';
import type { ComponentPropsWithRef, ComponentType } from 'react';
import createIconAriaProps from '../_internal/_createIconAriaProps';
import SvgIconFrame from '../SvgIconFrame';
import type { SvgIconComponent, SvgIconProps, SvgIconSet } from './types';

/**
 * アイコンの名前と SVG の部品（lucide-react・heroicons の部品や、自分で書いた部品）の対応表から、
 * アイコンの部品を作る\
 * 作った部品は `value` でアイコンの名前を受け取り、アイコンの箱の `<span>` の中に、対応する部品を描く。
 * 名前の型は対応表のキーから決まる。その他の props は `<span>` に渡す
 * （`className`・`style` は合成し、同じプロパティは受け取った値を優先する）
 *
 * - `aria-label`・`aria-labelledby` が無ければ飾りとして `aria-hidden` を付け、あれば `role="img"` を付ける
 * - 対応表に無い名前を受け取ったときは、空の箱（`SvgIconFrame`）を描き、並びを崩さない
 * - 部品には props を渡さない。部品の `fill`・`stroke` などの属性は、部品のものをそのまま使い、大きさは箱に合わせる
 * - 見た目には `@fringeworks/react-icon/styles.css` が要る
 *
 * @param icons アイコンの名前と SVG の部品の対応表
 * @returns アイコンの部品
 */
export default function createSvgIcon<V extends string>(
  icons: SvgIconSet<V>,
): SvgIconComponent<V> {
  function SvgIcon(props: SvgIconProps<V>) {
    const { value, ...rest } = props;
    // Object.prototype のプロパティ（toString など）を拾わない
    if (!hasOwn(icons, value)) {
      return <SvgIconFrame {...rest} />;
    }
    // V が型引数のままだと部品の props を解決できないため、props を受け取らない部品として扱う
    const Icon: ComponentType = icons[value];
    return (
      <span
        {...mergeProps<ComponentPropsWithRef<'span'>, HTMLSpanElement>(
          createIconAriaProps(rest),
          { className: 'frg-icon frg-svgicon' },
          rest,
        )}
      >
        <Icon />
      </span>
    );
  }

  SvgIcon.displayName = 'SvgIcon';

  return SvgIcon;
}
