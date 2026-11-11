import createFontIconProps, {
  type FontIconDefinition,
  type FontIconProps,
} from '../createFontIconProps';
import type { FontIconComponent, FontIconWebFont } from './types';

/**
 * フォントのアイコンのセットの定義から、アイコンの部品を作る\
 * 作った部品は `value` でアイコンの名前を受け取り、`<span>` に描く。
 * その他の props は `<span>` に渡す（`className`・`style` は合成し、同じプロパティは受け取った値を優先する）
 *
 * - `aria-label`・`aria-labelledby` が無ければ飾りとして `aria-hidden` を付け、あれば `role="img"` を付ける
 * - 部品の `webFonts` に、このセットのアイコンを描くのに要る Web フォントを持つ（ロード中にスケルトンを出すときなどに使う）
 * - 見た目には `@fringeworks/react-icon/styles.css` が要る
 *
 * @param definition フォントのアイコンのセットの定義
 * @returns アイコンの部品
 */
export default function createFontIcon<V extends string>(
  definition: FontIconDefinition<V>,
): FontIconComponent<V> {
  function FontIcon(props: FontIconProps<V>) {
    return <span {...createFontIconProps(definition, props)} />;
  }

  const { fontFamily } = definition;
  FontIcon.displayName = fontFamily ? `FontIcon(${fontFamily})` : 'FontIcon';
  FontIcon.webFonts = _createWebFonts(definition);

  return FontIcon;
}

function _createWebFonts<V extends string>(
  definition: FontIconDefinition<V>,
): readonly FontIconWebFont[] {
  const { fontFamily, fontWeight, fontStyle } = definition;
  if (!fontFamily) {
    return [];
  }
  return [
    {
      family: fontFamily,
      ...(fontWeight !== undefined && { weight: fontWeight }),
      ...(fontStyle !== undefined && { style: fontStyle }),
    },
  ];
}
