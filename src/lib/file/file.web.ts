import { extname, basename } from 'path-browserify';
import type { FileInfo } from './type';

export async function getExt(file: string): Promise<string> {
  try {
    return extname(file);
  } catch (error) {
    return '';
  }
}

export async function getBasename(file: string, ext: string): Promise<string> {
  try {
    return basename(file, ext);
  } catch (err) {
    return '';
  }
}

export async function getFileInfo(file: string): Promise<FileInfo> {
  const ext = await getExt(file);
  const name = await getBasename(file, ext);
  const fullName = `${name}${ext}`;

  return { name, ext, fullName };
}
