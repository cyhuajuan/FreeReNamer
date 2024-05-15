import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Rule } from '@/lib/rule';
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const RuleReplaceForm: FC = () => {
  const form = useFormContext<Rule>();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <FormField
          control={form.control}
          name="info.match"
          render={({ field }) => (
            <FormItem>
              <FormLabel>查找</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="info.replace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>替换</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <FormField
          control={form.control}
          name="info.useRegExp"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>使用正则表达式</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="info.caseSensitive"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>区分大小写</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="info.matchAll"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>匹配所有符合项</FormLabel>
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
    </div>
  );
};
