import { atom, createStore } from 'jotai';
import type { ReactNode } from 'react';

export const atomStore = createStore();

export const filesAtom = atom<string[]>([]);

export interface GlobalDialogInfo {
  opened: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
}

export const globalDialogInfoAtom = atom<GlobalDialogInfo>({
  opened: false,
});

export interface GlobalAlertInfo {
  opened: boolean;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}

export const globalAlertInfoAtom = atom<GlobalAlertInfo>({
  opened: false,
});
