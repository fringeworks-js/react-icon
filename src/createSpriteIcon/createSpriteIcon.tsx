import SvgIconFrame from '../SvgIconFrame';
import type {
  SpriteIconComponent,
  SpriteIconDefinition,
  SpriteIconProps,
} from './types';

/**
 * スプライト（`<symbol>` をまとめた SVG）のアイコンのセットの定義から、アイコンの部品を作る\
 * 作った部品は `value` でアイコンの名前を受け取り、アイコンの箱の `<span>` の中の `<svg>` に、`<use>` で `<symbol>` を描く。
 * その他の props は `<span>` に渡す（`className`・`style` は合成し、同じプロパティは受け取った値を優先する）
 *
 * - 名前の型は型引数で渡す（`createSpriteIcon<'home' | 'menu'>(…)`）
 * - `aria-label`・`aria-labelledby` が無ければ飾りとして `aria-hidden` を付け、あれば `role="img"` を付ける
 * - 名前に合う `<symbol>` が無ければ、空の箱になる
 * - 別のファイルのスプライトは、ページと同じオリジンに置く（ブラウザーが別のオリジンの `<use>` を描かないため）
 * - 見た目には `@fringeworks/react-icon/styles.css` が要る
 *
 * @param definition スプライトのアイコンのセットの定義
 * @returns アイコンの部品
 */
export default function createSpriteIcon<V extends string>(
  definition: SpriteIconDefinition<V>,
): SpriteIconComponent<V> {
  const { href } = definition;
  const createHref =
    typeof href === 'function' ? href : (name: V) => `${href}#${name}`;

  function SpriteIcon(props: SpriteIconProps<V>) {
    const { value, ...rest } = props;
    // <symbol> の viewBox で箱いっぱいに描かれるため、外側の viewBox は既定のままでよい
    return (
      <SvgIconFrame {...rest}>
        <use href={createHref(value)} />
      </SvgIconFrame>
    );
  }

  SpriteIcon.displayName = 'SpriteIcon';

  return SpriteIcon;
}
