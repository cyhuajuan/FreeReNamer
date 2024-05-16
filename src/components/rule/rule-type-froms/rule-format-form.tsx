import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  RULE_FORMAT_TYPES,
  RULE_FORMAT_TYPE_LABELS,
  type Rule,
} from '@/lib/rule';
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const RuleFormatForm: FC = () => {
  const form = useFormContext<Rule>();

  return (
    <div>
      <FormField
        control={form.control}
        name="info.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>格式化类型</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {RULE_FORMAT_TYPES.map((formatType) => (
                  <FormItem
                    key={formatType}
                    className="flex items-center gap-x-2 space-y-0 hover:opacity-60"
                  >
                    <FormControl>
                      <RadioGroupItem value={formatType} />
                    </FormControl>
                    <FormLabel>{RULE_FORMAT_TYPE_LABELS[formatType]}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
