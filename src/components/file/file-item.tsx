import { useQuery } from '@tanstack/react-query';
import { useMemo, type FC } from 'react';
import { fileItemInfoQueryOptions } from '@/lib/queries/file';
import { atomStore, selectedFilesAtom } from '@/lib/atoms';
import { Checkbox } from '../ui/checkbox';
import { useAtomValue } from 'jotai';

export interface FileItemProps {
  file: string;
  profileId: string;
  index: number;
}

export const FileItem: FC<FileItemProps> = ({ file, profileId, index }) => {
  const {
    data: fileItemInfo,
    error,
    isError,
  } = useQuery(fileItemInfoQueryOptions(profileId, file, index));

  const selectedFiles = useAtomValue(selectedFilesAtom);
  const selected = useMemo(
    () => selectedFiles.includes(file),
    [selectedFiles, file],
  );

  function onCheckedChange(checked: boolean) {
    atomStore.set(selectedFilesAtom, (prev) => {
      if (checked) {
        return [...prev, file];
      }

      return prev.filter((item) => item !== file);
    });
  }

  if (isError) {
    return (
      <div className="grid min-h-8 w-full grid-cols-1 divide-x break-all text-sm hover:bg-neutral-100">
        <div className="flex items-center justify-center">
          {error as unknown as string}
        </div>
      </div>
    );
  }

  if (!fileItemInfo) {
    return null;
  }

  return (
    <div className="grid min-h-8 w-full grid-cols-[2rem_3rem_48%_1fr] divide-x break-all text-sm hover:bg-neutral-100">
      <div className="flex size-full items-center justify-center">
        <Checkbox checked={selected} onCheckedChange={onCheckedChange} />
      </div>
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
  );
};
