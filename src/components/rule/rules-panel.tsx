import { useEffect, useState, type FC } from 'react';
import { Button } from '../ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileQueryOptions } from '@/lib/queries/profile';
import { RuleItem } from './rule-item';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { RuleEditPanel } from './rule-edit-panel';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import {
  getRuleTypeDefaultValue,
  type Rule,
  RULE_REPLACE_TYPE,
} from '@/lib/rule';
import { updateProfile } from '@/lib/profile';
import { QueryType } from '@/lib/query';
import { ScrollArea } from '../ui/scroll-area';
import { RuleEditDialog } from './rule-edit-dialog';

export interface RulesPanelProps {
  profileId: string;
}

export const RulesPanel: FC<RulesPanelProps> = ({ profileId }) => {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery(profileQueryOptions(profileId));
  const [addRuleDialogOpened, setAddRuleDialogOpened] = useState(false);
  const [targetEditRule, setTargetEditRule] = useState<Rule | undefined>();

  const { mutate: addRule } = useMutation({
    mutationFn: async (rule: Rule) => {
      if (!profile) {
        return;
      }

      return updateProfile(profileId, {
        ...profile,
        rules: [...profile.rules, rule],
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [QueryType.Profile, { id: profileId }],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryType.FileItemInfo, { profileId }],
      });
    },
  });

  const { mutate: deleteRule } = useMutation({
    mutationFn: async (ruleId: string) => {
      if (!profile) {
        return;
      }

      return updateProfile(profileId, {
        ...profile,
        rules: profile.rules.filter((rule) => rule.id !== ruleId),
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [QueryType.Profile, { id: profileId }],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryType.FileItemInfo, { profileId }],
      });
    },
  });

  const { mutate: updateRuleChecked } = useMutation({
    mutationFn: async ({
      ruleId,
      checked,
    }: { ruleId: string; checked: boolean }) => {
      if (!profile) {
        return;
      }

      return updateProfile(profileId, {
        ...profile,
        rules: profile.rules.map((rule) => {
          if (rule.id === ruleId) {
            return {
              ...rule,
              enabled: checked,
            };
          }

          return rule;
        }),
      });
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [QueryType.Profile, { id: profileId }],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryType.FileItemInfo, { profileId }],
      });
    },
  });

  const { mutate: updateRule } = useMutation({
    mutationFn: async (rule: Rule) => {
      if (!profile) {
        return;
      }

      return updateProfile(profileId, {
        ...profile,
        rules: profile.rules.map((r) => {
          if (rule.id === r.id) {
            return {
              ...r,
              ...rule,
            };
          }

          return r;
        }),
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [QueryType.Profile, { id: profileId }],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryType.FileItemInfo, { profileId }],
      });
    },
  });

  const form = useForm<Rule>({
    defaultValues: getRuleTypeDefaultValue(RULE_REPLACE_TYPE),
  });

  function handleAddRule() {
    setAddRuleDialogOpened(true);
  }

  function onSubmit(values: Rule) {
    addRule(values);

    setAddRuleDialogOpened(false);
  }

  function onUpdateRule(values: Rule) {
    updateRule(values);

    setTargetEditRule(undefined);
  }

  function onCloseRuleEditDialog() {
    setTargetEditRule(undefined);
  }

  useEffect(() => {
    if (!addRuleDialogOpened) {
      form.reset(getRuleTypeDefaultValue(RULE_REPLACE_TYPE));
    }
  }, [addRuleDialogOpened, form.reset]);

  return (
    <>
      <div className="size-full">
        <div className="flex w-full items-center pb-4">
          <Button size="sm" onClick={handleAddRule}>
            添加规则
          </Button>
        </div>
        <div className="grid h-8 grid-cols-[25%_100px_1fr_3rem] divide-x divide-neutral-300 rounded-t bg-neutral-200 text-sm">
          <span className="flex size-full items-center px-2">名称</span>
          <span className="flex size-full items-center justify-center px-2">
            规则
          </span>
          <span className="flex size-full items-center px-2">说明</span>
          <div />
        </div>
        <ScrollArea className="h-[calc(100%-5rem)] w-full rounded-b border border-t-0">
          <div className="w-full divide-y">
            {profile?.rules?.map((rule) => {
              return (
                <RuleItem
                  key={rule.id}
                  rule={rule}
                  onDel={() => deleteRule(rule.id)}
                  onSwitch={(checked) =>
                    updateRuleChecked({ ruleId: rule.id, checked })
                  }
                  onEdit={() => setTargetEditRule(rule)}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <Dialog open={addRuleDialogOpened} onOpenChange={setAddRuleDialogOpened}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="grid h-[70vh] w-full grid-cols-1 grid-rows-[max-content_1fr]"
        >
          <DialogHeader>
            <DialogTitle>添加规则</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid size-full grid-rows-[1fr_max-content] gap-y-4 overflow-hidden"
              autoComplete="off"
            >
              <RuleEditPanel />
              <div className="flex w-full items-end justify-end gap-x-2">
                <DialogClose asChild>
                  <Button variant="ghost">取消</Button>
                </DialogClose>
                <Button type="submit">添加</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <RuleEditDialog
        rule={targetEditRule}
        onSubmit={onUpdateRule}
        onOpenedChange={onCloseRuleEditDialog}
      />
    </>
  );
};
