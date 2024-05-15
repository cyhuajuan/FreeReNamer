import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { fileItemInfoQueryOptions } from '@/lib/queries/file';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { atomStore, filesAtom } from '@/lib/atoms';

export interface FileItemProps {
  file: string;
  profileId: string;
  index: number;
}

export const FileItem: FC<FileItemProps> = ({ file, profileId, index }) => {
  const { data: fileItemInfo } = useQuery(
    fileItemInfoQueryOptions(profileId, file, index),
  );

  function onRemove() {
    atomStore.set(filesAtom, (prevFiles) => {
      return prevFiles.filter((item) => item !== file);
    });
  }

  if (!fileItemInfo) {
    return null;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="grid min-h-8 w-full grid-cols-[3rem_48%_1fr] divide-x break-all text-sm hover:bg-neutral-100">
          <span className="flex size-full items-center justify-center px-2 py-1 text-neutral-700">
            {index + 1}
          </span>
          <span className="flex size-full items-center px-2 py-1 text-neutral-700">
            {fileItemInfo.fileInfo.fullName}
          </span>
          <span className="flex size-full items-center px-2 py-1 font-bold">
            {fileItemInfo.preview}
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onRemove}>移除</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
