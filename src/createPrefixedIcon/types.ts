import type { IconComponent, IconSlotProps } from '@fringeworks/react-contract';
import type { ComponentProps, ReactElement } from 'react';

// アイコンの口の型。createPrefixedIcon で作った部品が受け取る props と、対応表の部品の型に使うので、同じ名前で export する
export type { IconComponent, IconSlotProps } from '@fringeworks/react-contract';

/**
 * `createPrefixedIcon` に渡す、接頭辞とアイコンの部品の対応表\
 * 部品は `IconSlotProps`（`value` でアイコンの名前と、読み上げの props など）を受け取れるもの
 */
export type PrefixedIconSet = Readonly<Record<string, IconComponent>>;

/**
 * `createPrefixedIcon` で作った部品の `value` の型（`接頭辞:名前`）
 */
export type PrefixedIconValue<S extends PrefixedIconSet> = {
  [K in keyof S & string]: `${K}:${ComponentProps<S[K]>['value'] & string}`;
}[keyof S & string];

/**
 * `createPrefixedIcon` で作ったアイコンの部品のプロパティ
 */
export type PrefixedIconProps<S extends PrefixedIconSet> = IconSlotProps<
  PrefixedIconValue<S>
>;

/**
 * `createPrefixedIcon` で作ったアイコンの部品
 */
export type PrefixedIconComponent<S extends PrefixedIconSet> = {
  (props: PrefixedIconProps<S>): ReactElement;

  displayName?: string;
};
