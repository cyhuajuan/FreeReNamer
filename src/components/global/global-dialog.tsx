import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { useAtom } from 'jotai';
import { globalDialogInfoAtom } from '@/lib/atoms';

export const GlobalDialog: FC = () => {
  const [dialogInfo, setDialogInfo] = useAtom(globalDialogInfoAtom);

  function onOpenChange(opened: boolean) {
    setDialogInfo((prev) => ({ ...prev, opened }));
  }

  return (
    <Dialog open={dialogInfo.opened} onOpenChange={onOpenChange}>
      <DialogContent className={dialogInfo.contentClassName}>
        {dialogInfo.title && <DialogTitle>{dialogInfo.title}</DialogTitle>}
        {dialogInfo.description && (
          <DialogDescription>{dialogInfo.description}</DialogDescription>
        )}
        {dialogInfo.children}
      </DialogContent>
    </Dialog>
  );
};
