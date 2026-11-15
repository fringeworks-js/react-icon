import type { ValueProps } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ComponentType, ReactElement } from 'react';

/**
 * `createSvgIcon` に渡す、アイコンの名前と SVG の部品の対応表\
 * 部品は `<svg>` を描くもの（lucide-react・heroicons の部品など）。props は渡さない
 */
export type SvgIconSet<V extends string> = Readonly<Record<V, ComponentType>>;

/**
 * `createSvgIcon` で作ったアイコンの部品のプロパティ\
 * `value` 以外は、アイコンの箱の `<span>` に渡す
 */
export type SvgIconProps<V extends string> = ValueProps<V> &
  Omit<ComponentPropsWithRef<'span'>, 'children'>;

/**
 * `createSvgIcon` で作ったアイコンの部品
 */
export type SvgIconComponent<V extends string> = {
  (props: SvgIconProps<V>): ReactElement;

  displayName?: string;
};
