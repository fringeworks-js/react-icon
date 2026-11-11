import createFontIconProps from './createFontIconProps';

describe('createFontIconProps', () => {
  describe('文字', () => {
    it('既定は名前をそのまま入れる（合字）', () => {
      expect(createFontIconProps({}, { value: 'home' }).children).toBe('home');
    });

    it("'none' は何も入れない", () => {
      expect(
        createFontIconProps({ text: 'none' }, { value: 'home' }).children,
      ).toBeUndefined();
    });

    it('対応表は名前に対応する文字を入れる', () => {
      const text = { home: '\ue900' };
      expect(createFontIconProps({ text }, { value: 'home' }).children).toBe(
        '\ue900',
      );
    });

    it('対応表に無い名前は何も入れない（Object.prototype のプロパティも拾わない）', () => {
      const text: Record<string, string> = { home: '\ue900' };
      expect(
        createFontIconProps<string>({ text }, { value: 'menu' }).children,
      ).toBeUndefined();
      expect(
        createFontIconProps<string>({ text }, { value: 'toString' }).children,
      ).toBeUndefined();
    });

    it('関数は戻り値を入れる', () => {
      expect(
        createFontIconProps(
          { text: (name) => name.toUpperCase() },
          { value: 'home' },
        ).children,
      ).toBe('HOME');
    });
  });

  describe('クラス', () => {
    it('共通のクラスと種類のクラスを付ける', () => {
      expect(createFontIconProps({}, { value: 'home' }).className).toBe(
        'frg-icon frg-fonticon',
      );
    });

    it('定義のクラスを足す（関数は名前を受け取る）', () => {
      expect(
        createFontIconProps(
          { className: (name) => `fa-solid fa-${name}` },
          { value: 'house' },
        ).className,
      ).toBe('frg-icon frg-fonticon fa-solid fa-house');
      expect(
        createFontIconProps({ className: 'icons' }, { value: 'house' })
          .className,
      ).toBe('frg-icon frg-fonticon icons');
    });

    it('受け取った className を後に足す', () => {
      expect(
        createFontIconProps(
          { className: 'icons' },
          { value: 'home', className: 'mine' },
        ).className,
      ).toBe('frg-icon frg-fonticon icons mine');
    });
  });

  describe('style', () => {
    it('定義の font-family などを入れる', () => {
      expect(
        createFontIconProps(
          { fontFamily: 'Icons', fontWeight: 400, fontStyle: 'normal' },
          { value: 'home' },
        ).style,
      ).toEqual({ fontFamily: 'Icons', fontWeight: 400, fontStyle: 'normal' });
    });

    it('定義に無いものは入れない', () => {
      expect(createFontIconProps({}, { value: 'home' }).style).toEqual({});
    });

    it('受け取った style を重ね、同じプロパティは受け取った値を優先する', () => {
      expect(
        createFontIconProps(
          { fontFamily: 'Icons' },
          { value: 'home', style: { fontFamily: 'Mine', color: 'red' } },
        ).style,
      ).toEqual({ fontFamily: 'Mine', color: 'red' });
    });
  });

  describe('読み上げ', () => {
    it('名前が無ければ aria-hidden を付ける', () => {
      const props = createFontIconProps({}, { value: 'home' });
      expect(props['aria-hidden']).toBe(true);
      expect(props.role).toBeUndefined();
    });

    it('aria-label があれば role="img" を付ける', () => {
      const props = createFontIconProps(
        {},
        { value: 'home', 'aria-label': 'ホーム' },
      );
      expect(props.role).toBe('img');
      expect(props['aria-label']).toBe('ホーム');
      expect(props['aria-hidden']).toBeUndefined();
    });

    it('受け取った role・aria-hidden を優先する', () => {
      expect(
        createFontIconProps(
          {},
          { value: 'home', 'aria-label': 'ホーム', role: 'presentation' },
        ).role,
      ).toBe('presentation');
      expect(
        createFontIconProps({}, { value: 'home', 'aria-hidden': false })[
          'aria-hidden'
        ],
      ).toBe(false);
    });
  });

  it('value は要素に渡さず、その他の props は渡す', () => {
    const props = createFontIconProps(
      {},
      { value: 'home', id: 'icon', title: 'ホーム' },
    );
    expect(props).not.toHaveProperty('value');
    expect(props.id).toBe('icon');
    expect(props.title).toBe('ホーム');
  });
});
