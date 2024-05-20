import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RULE_TEMPLATE_TYPE, Rule, RuleTemplateInfo } from '@/lib/rules';
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const RuleTemplateForm: FC = () => {
  const form =
    useFormContext<Rule<typeof RULE_TEMPLATE_TYPE, RuleTemplateInfo>>();

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        control={form.control}
        name="info.template"
        render={({ field }) => (
          <FormItem>
            <FormLabel>模板</FormLabel>
            <FormControl>
              <Input placeholder="请输入模板内容" {...field} />
            </FormControl>
            <p className="text-[0.8rem] text-muted-foreground">
              示例：文件：[xxx.mp4] 模板：
              {'[File-${fileInfo.name}]  输出：File-xxx.mp4'}
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              支持的变量：fileInfo.name、fileInfo.fullName、fileInfo.ext、index
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              支持js逻辑运算，比如：{'${index + 1}'}
            </p>
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
