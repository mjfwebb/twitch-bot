export const bttvModifiers = ['w!', 'h!', 'v!', 'z!', 'c!', 'l!', 'r!', 'p!'];
type BTTVModifier = (typeof bttvModifiers)[number];

export const bttvModifierMap: Record<BTTVModifier, string> = {
  'h!': 'flipx',
  'v!': 'flipy',
  'w!': 'growx',
  'r!': 'rotate',
  'l!': 'rotateLeft',
  'z!': 'zerowidth',
  'c!': 'cursed',
  'p!': 'party',
};
