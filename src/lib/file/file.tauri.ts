import { extname } from '@tauri-apps/api/path';
import type { FileInfo } from './type';

export async function getExt(file: string): Promise<string> {
  try {
    return `.${await extname(file)}`;
  } catch (error) {
    return '';
  }
}

export async function getBasename(file: string): Promise<string> {
  try {
    const { invoke } = await import('@tauri-apps/api');

    return await invoke('basename', { path: file });
  } catch (err) {
    return '';
  }
}

export async function getFileInfo(file: string): Promise<FileInfo> {
  const ext = await getExt(file);
  const name = await getBasename(file);
  const fullName = `${name}${ext}`;

  return { name, ext, fullName };
}
