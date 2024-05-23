import { lazy, type FC } from 'react';

const FilesPanelTauri = lazy(() => import('./files-panel.tauri'));
const FilesPanelWeb = lazy(() => import('./files-panel.web'));

export interface FilesPanelProps {
  profileId: string;
}

export const FilesPanel: FC<FilesPanelProps> = ({ profileId }) => {
  if (__PLATFORM__ === __PLATFORM_TAURI__) {
    return <FilesPanelTauri profileId={profileId} />;
  }

  if (__PLATFORM__ === __PLATFORM_WEB__) {
    return <FilesPanelWeb profileId={profileId} />;
  }

  return null;
};
