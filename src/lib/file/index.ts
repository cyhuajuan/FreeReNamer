import type { FileInfo } from './type';
export type { FileInfo } from './type';

export async function getFileInfo(file: string): Promise<FileInfo> {
  if (__PLATFORM__ === __PLATFORM_TAURI__) {
    const { getFileInfo } = await import('./file.tauri');

    return getFileInfo(file);
  }

  if (__PLATFORM__ === __PLATFORM_WEB__) {
    const { getFileInfo } = await import('./file.web');

    return getFileInfo(file);
  }

  throw new Error('Not Implemented');
}
