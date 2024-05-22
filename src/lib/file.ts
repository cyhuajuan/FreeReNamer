import { extname } from '@tauri-apps/api/path';

export interface FileInfo {
  name: string;
  ext: string;
  fullName: string;
}

export async function getExt(file: string): Promise<string> {
  try {
    return `.${await extname(file)}`;
  } catch (error) {
    return '';
  }
}

export async function getBasename(file: string): Promise<string> {
  try {
    const module = await import('@tauri-apps/api');

    return await module.invoke('basename', { path: file });
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
