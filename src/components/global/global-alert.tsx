import { globalAlertInfoAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export const GlobalAlert: FC = () => {
  const [alertInfo, setAlertInfo] = useAtom(globalAlertInfoAtom);

  function onOpenChange(opened: boolean) {
    setAlertInfo((prev) => ({ ...prev, opened }));
  }

  return (
    <AlertDialog open={alertInfo.opened} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {alertInfo.title && (
            <AlertDialogTitle>{alertInfo.title}</AlertDialogTitle>
          )}
          {alertInfo.description && (
            <AlertDialogDescription>
              {alertInfo.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {alertInfo.footer && (
          <AlertDialogFooter>{alertInfo.footer}</AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
