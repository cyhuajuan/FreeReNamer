import {
  RULE_SCRIPT_TYPE,
  getRuleDefines,
  getRuleTypeDefaultValue,
  type Rule,
} from '@/lib/rule';
import { useMemo, type FC } from 'react';
import { RuleFormRender } from './rule-form-render';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

export interface RuleEditPanelProps {
  allowChangeType?: boolean;
}

export const RuleEditPanel: FC<RuleEditPanelProps> = ({
  allowChangeType = true,
}) => {
  const form = useFormContext<Rule>();
  const typeValue = form.watch('type');
  const ruleDefines = useMemo(() => {
    return getRuleDefines();
  }, []);

  return (
    <div className="flex size-full h-full gap-x-4 overflow-hidden">
      {allowChangeType && (
        <ScrollArea className="h-full w-28 shrink-0">
          <div className="flex w-full flex-col gap-y-1">
            {ruleDefines.map((ruleDefine) => (
              <div
                key={ruleDefine.type}
                onClick={() =>
                  form.reset(getRuleTypeDefaultValue(ruleDefine.type))
                }
                data-active={typeValue === ruleDefine.type || null}
                className="flex h-8 w-full cursor-default items-center justify-center rounded text-sm transition-colors data-[active]:bg-primary hover:bg-accent data-[active]:text-primary-foreground hover:text-accent-foreground"
              >
                {ruleDefine.label}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      <div className="grid h-full flex-1 grid-rows-[max-content_1fr] gap-y-4 overflow-hidden">
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
        <fieldset
          className={cn(
            'size-full rounded border',
            typeValue !== RULE_SCRIPT_TYPE && 'overflow-hidden',
          )}
        >
          <legend className="ml-3 px-1 font-bold text-sm">规则配置</legend>
          {typeValue === RULE_SCRIPT_TYPE ? (
            <div className="size-full p-4 pt-2">
              <RuleFormRender type={typeValue} />
            </div>
          ) : (
            <ScrollArea className="size-full">
              <div className="p-4 pt-2">
                <RuleFormRender type={typeValue} />
              </div>
            </ScrollArea>
          )}
        </fieldset>
      </div>
    </div>
  );
};
