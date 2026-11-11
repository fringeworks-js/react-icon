import type { ValueProps } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ComponentType, ReactElement } from 'react';

/**
 * `createSvgIcon` が、組み込んだ SVG の部品に渡す props（`<svg>` の props）\
 * 部品は、受け取った props（`className`・`style`・`aria-*`・`ref` など）を `<svg>` に渡す必要がある
 */
export type SvgIconSlotProps = Omit<ComponentPropsWithRef<'svg'>, 'children'>;

/**
 * `createSvgIcon` に渡す、アイコンの名前と SVG の部品の対応表
 */
export type SvgIconSet<V extends string> = Readonly<
  Record<V, ComponentType<SvgIconSlotProps>>
>;

/**
 * `createSvgIcon` で作ったアイコンの部品のプロパティ
 */
export type SvgIconProps<V extends string> = ValueProps<V> & SvgIconSlotProps;

/**
 * `createSvgIcon` で作ったアイコンの部品
 */
export type SvgIconComponent<V extends string> = {
  (props: SvgIconProps<V>): ReactElement;

  displayName?: string;
};
