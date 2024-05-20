import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  RULE_INSERT_TYPES,
  RULE_INSET_TYPE_LABELS,
  type RULE_INSERT_TYPE,
  type Rule,
  type RuleInsertInfo,
} from '@/lib/rules';
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const RuleInsertForm: FC = () => {
  const form = useFormContext<Rule<typeof RULE_INSERT_TYPE, RuleInsertInfo>>();

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        control={form.control}
        name="info.content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>内容</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoComplete="off"
                placeholder="请输入要插入的内容"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="info.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>插入类型</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {RULE_INSERT_TYPES.map((insertType) => (
                  <FormItem
                    key={insertType}
                    className="flex items-center gap-x-2 space-y-0 hover:opacity-60"
                  >
                    <FormControl>
                      <RadioGroupItem value={insertType} />
                    </FormControl>
                    <FormLabel>{RULE_INSET_TYPE_LABELS[insertType]}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="info.includeExt"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>包含扩展名</FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};
