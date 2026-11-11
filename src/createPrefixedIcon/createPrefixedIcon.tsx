import type { ValueProps } from '@fringeworks/react-contract';
import { mergeProps } from '@fringeworks/react-merge';
import { hasOwn } from '@fringeworks/utils/object/hasOwn';
import type { ComponentPropsWithRef, ComponentType } from 'react';
import createIconAriaProps from '../_internal/_createIconAriaProps';
import type {
  PrefixedIconComponent,
  PrefixedIconProps,
  PrefixedIconSet,
  PrefixedIconSlotProps,
} from './types';

/**
 * 接頭辞とアイコンの部品の対応表から、`接頭辞:名前` の値でアイコンを選ぶ部品を作る\
 * 設定（JSON など）の文字列から、種類の違うアイコンのセットを混ぜて選ぶときに使う。
 * 作った部品は `value` を最初の `:` で分け、接頭辞の部品に名前と props を渡す。名前の型は対応表の部品から決まる
 *
 * - `value` 以外に受け取る props は `PrefixedIconSlotProps`（`className`・`style`・読み上げの props など）だけ
 * - 対応表に無い接頭辞や、`:` の無い値を受け取ったときは、空の箱（`<span class="frg-icon">`）を描き、並びを崩さない
 * - 接頭辞はあるが名前がそのセットに無いときの扱いは、そのセットの部品に任せる
 * - 見た目には `@fringeworks/react-icon/styles.css` が要る
 *
 * @param icons 接頭辞とアイコンの部品の対応表
 * @returns アイコンの部品
 */
export default function createPrefixedIcon<S extends PrefixedIconSet>(
  icons: S,
): PrefixedIconComponent<S> {
  function PrefixedIcon(props: PrefixedIconProps<S>) {
    const { value: prefixedValue, ...rest } = props;
    // 型引数のままの PrefixedIconValue<S> では文字列のメソッドを使えないため
    const value: string = prefixedValue;
    const index = value.indexOf(':');
    const prefix = value.slice(0, index);
    // Object.prototype のプロパティ（toString など）を拾わない
    if (index < 0 || !hasOwn(icons, prefix)) {
      return (
        <span
          {...mergeProps<ComponentPropsWithRef<'span'>, HTMLSpanElement>(
            createIconAriaProps(rest),
            { className: 'frg-icon' },
            rest,
          )}
        />
      );
    }
    // 名前がそのセットにあるかは確かめず、部品に任せるため、名前を string として渡す
    const Icon = icons[prefix] as ComponentType<
      ValueProps<string> & PrefixedIconSlotProps
    >;
    return <Icon {...rest} value={value.slice(index + 1)} />;
  }

  PrefixedIcon.displayName = 'PrefixedIcon';

  return PrefixedIcon;
}
