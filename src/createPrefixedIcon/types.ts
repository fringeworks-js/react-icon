import type { ValueProps } from '@fringeworks/react-contract';
import type {
  ComponentProps,
  ComponentType,
  HTMLAttributes,
  ReactElement,
} from 'react';

/**
 * `createPrefixedIcon` で作った部品が受け取り、対応表の部品に渡す props（`value` を除く）\
 * フォント（`<span>`）・SVG（`<svg>`）のどちらの部品にも渡せるものに絞っている
 */
export type PrefixedIconSlotProps = Pick<
  HTMLAttributes<Element>,
  | 'className'
  | 'style'
  | 'id'
  | 'title'
  | 'role'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
>;

/**
 * `createPrefixedIcon` に渡す、接頭辞とアイコンの部品の対応表\
 * 部品は `value` でアイコンの名前を受け取り、`PrefixedIconSlotProps` を受け取れるもの
 */
export type PrefixedIconSet = Readonly<
  Record<string, ComponentType<ValueProps<never> & PrefixedIconSlotProps>>
>;

/**
 * `createPrefixedIcon` で作った部品の `value` の型（`接頭辞:名前`）
 */
export type PrefixedIconValue<S extends PrefixedIconSet> = {
  [K in keyof S & string]: `${K}:${ComponentProps<S[K]>['value'] & string}`;
}[keyof S & string];

/**
 * `createPrefixedIcon` で作ったアイコンの部品のプロパティ
 */
export type PrefixedIconProps<S extends PrefixedIconSet> = ValueProps<
  PrefixedIconValue<S>
> &
  PrefixedIconSlotProps;

/**
 * `createPrefixedIcon` で作ったアイコンの部品
 */
export type PrefixedIconComponent<S extends PrefixedIconSet> = {
  (props: PrefixedIconProps<S>): ReactElement;

  displayName?: string;
};
