import { atom, createStore } from 'jotai';

export const atomStore = createStore();

export const filesAtom = atom<string[]>([]);
