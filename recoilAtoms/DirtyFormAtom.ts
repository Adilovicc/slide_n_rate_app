import { atom } from 'recoil';

export const dirtyFormAtom = atom({
  key: 'dirtyFormAtom', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});