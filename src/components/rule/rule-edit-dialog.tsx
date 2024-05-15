import type { Rule } from '@/lib/rule';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { RuleEditPanel } from './rule-edit-panel';
import { Form } from '../ui/form';

export interface RuleEditDialogContentProps {
  rule?: Rule;
  onSubmit: (values: Rule) => void;
}

export const RuleEditDialogContent: FC<RuleEditDialogContentProps> = ({
  rule,
  onSubmit,
}) => {
  const form = useForm<Rule>({
    defaultValues: rule,
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>修改规则</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-[70vh] w-full flex-col gap-y-4"
          autoComplete="off"
        >
          <div className="w-full flex-1">
            <RuleEditPanel allowChangeType={false} />
          </div>
          <div className="flex w-full shrink-0 items-end justify-end gap-x-2">
            <DialogClose asChild>
              <Button variant="ghost">取消</Button>
            </DialogClose>
            <Button type="submit">确定</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export interface RuleEditDialogProps {
  rule?: Rule;
  onSubmit: (values: Rule) => void;
  onOpenedChange: (open: boolean) => void;
}

export const RuleEditDialog: FC<RuleEditDialogProps> = ({
  rule,
  onSubmit,
  onOpenedChange,
}) => {
  const opened = !!rule;

  return (
    <Dialog open={opened} onOpenChange={onOpenedChange}>
      <DialogContent>
        {rule && <RuleEditDialogContent rule={rule} onSubmit={onSubmit} />}
      </DialogContent>
    </Dialog>
  );
};
