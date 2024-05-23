import { atom, createStore, type PrimitiveAtom } from 'jotai';
import type { ReactNode } from 'react';

export const atomStore = createStore();

export const filesAtom = atom<string[] | FileSystemFileHandle[]>([]);

export type FilesAtomTauri = PrimitiveAtom<string[]> &
  WithInitialValue<string[]>;
export type FilesAtomWeb = PrimitiveAtom<FileSystemFileHandle[]> &
  WithInitialValue<FileSystemFileHandle[]>;

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

export const selectedFilesAtom = atom<string[]>([]);
