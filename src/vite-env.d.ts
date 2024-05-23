/// <reference types="vite/client" />

declare const __PLATFORM__: string;
declare const __PLATFORM_TAURI__: string;
declare const __PLATFORM_WEB__: string;

interface OpenFilePickerOptions {
  multiple?: boolean;
}

interface Window {
  showOpenFilePicker(
    options?: OpenFilePickerOptions,
  ): Promise<FileSystemFileHandle[]>;
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}

type WithInitialValue<Value> = {
  init: Value;
};

interface FileSystemFileHandle {
  move: (newName: string) => Promise<void>;
}

interface FileSystemDirectoryHandle {
  values(): AsyncIterable<FileSystemDirectoryHandle | FileSystemFileHandle>;
}

interface DataTransferItem {
  getAsFileSystemHandle(): Promise<
    FileSystemFileHandle | FileSystemDirectoryHandle | null
  >;
}
