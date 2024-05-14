import {
  RULE_TYPES,
  RULE_TYPE_LABELS,
  getRuleTypeDefaultValue,
  type Rule,
} from '@/lib/rule';
import type { FC } from 'react';
import { RuleFormRender } from './rule-form-render';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

export const RuleAddPanel: FC = () => {
  const form = useFormContext<Rule>();
  const typeValue = form.watch('type');

  return (
    <div className="flex size-full h-full gap-x-4">
      <div className="flex w-28 shrink-0 flex-col gap-y-1">
        {RULE_TYPES.map((ruleType) => (
          <div
            key={ruleType}
            onClick={() => form.reset(getRuleTypeDefaultValue(ruleType))}
            data-active={typeValue === ruleType || null}
            className="flex h-8 w-full cursor-default items-center justify-center rounded text-sm transition-colors data-[active]:bg-primary hover:bg-accent data-[active]:text-primary-foreground hover:text-accent-foreground"
          >
            {RULE_TYPE_LABELS[ruleType]}
          </div>
        ))}
      </div>
      <div className="grid h-full flex-1 grid-rows-[max-content_1fr] gap-y-4">
        <fieldset className="size-full rounded border">
          <legend className="ml-3 px-1 font-bold text-sm">规则名称</legend>
          <div className="p-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <fieldset className="size-full rounded border">
          <legend className="ml-3 px-1 font-bold text-sm">规则配置</legend>
          <div className="size-full p-4 pt-2">
            <RuleFormRender type={typeValue} />
          </div>
        </fieldset>
      </div>
    </div>
  );
};
