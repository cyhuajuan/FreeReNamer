import { atomStore, filesAtom } from '@/lib/atoms';
import { listen } from '@tauri-apps/api/event';
import { useAtomValue } from 'jotai';
import { useEffect, type FC } from 'react';
import { FileItem } from './file-item';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export interface FilesPanelProps {
  profileId: string;
}

export const FilesPanel: FC<FilesPanelProps> = ({ profileId }) => {
  const files = useAtomValue(filesAtom);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    listen('tauri://file-drop', (e) => {
      if (!Array.isArray(e.payload)) {
        return;
      }

      atomStore.set(filesAtom, (prevFiles) => [
        ...new Set([...prevFiles, ...(e.payload as string[])]),
      ]);
    }).then((unlistenFn) => {
      unlisten = unlistenFn;
    });

    return () => {
      unlisten?.();
    };
  }, []);

  return (
    <div className="size-full">
      <div className="flex w-full gap-x-2 pb-4">
        <Button size="sm">添加文件</Button>
        <Button size="sm">添加文件夹</Button>
      </div>
      <div className="grid h-8 grid-cols-[3rem_48%_1fr] divide-x divide-neutral-300 bg-neutral-200 text-sm">
        <span className="flex size-full items-center justify-center px-2">
          序号
        </span>
        <span className="flex size-full items-center px-2">文件名</span>
        <span className="flex size-full items-center px-2">预览</span>
      </div>
      <ScrollArea className="h-[calc(100%-5rem)] w-full">
        <div className="flex w-full flex-col divide-y">
          {files.map((file, i) => {
            return (
              <FileItem
                key={file}
                file={file}
                profileId={profileId}
                index={i}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
