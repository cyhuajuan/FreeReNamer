import { Input } from '@/components/ui/input';
import { atomStore, globalAlertInfoAtom, globalDialogInfoAtom } from './atoms';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export function showRenameDialog(cb?: (name: string) => void) {
  atomStore.set(globalDialogInfoAtom, {
    opened: true,
    title: '重命名',
    contentClassName: 'max-w-[400px]',
    children: (
      <form
        className="flex flex-col gap-y-4"
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.target as HTMLFormElement);
          const inputName = formData.get('name')?.toString()?.trim();

          if (!inputName) {
            return;
          }

          cb?.(inputName);
        }}
      >
        <Input name="name" autoComplete="off" />
        <DialogClose asChild>
          <Button type="submit" className="self-end">
            确定
          </Button>
        </DialogClose>
      </form>
    ),
  });
}

export function showConfirm({
  title,
  description,
  onOk,
}: { title: string; description?: string; onOk?: () => void }) {
  atomStore.set(globalAlertInfoAtom, {
    opened: true,
    title,
    description,
    footer: (
      <>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction onClick={onOk}>确定</AlertDialogAction>
      </>
    ),
  });
}
