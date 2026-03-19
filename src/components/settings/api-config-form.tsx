import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ApiConfigSchema, getDefaultApiConfig, type ApiConfig } from '@/lib/settings/ai-config';

interface ApiConfigFormProps {
  defaultValues?: Partial<ApiConfig>;
  onSubmit: (values: ApiConfig) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ApiConfigForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = '保存',
}: ApiConfigFormProps) {
  const form = useForm<ApiConfig>({
    resolver: zodResolver(ApiConfigSchema),
    defaultValues: {
      ...getDefaultApiConfig(),
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>配置名称</FormLabel>
              <FormControl>
                <Input placeholder="给我的Ollama取个名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API类型</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ollama" id="ollama" />
                    <Label htmlFor="ollama" className="font-normal">
                      Ollama
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>服务器地址</FormLabel>
              <FormControl>
                <Input placeholder="http://localhost:11434" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>模型名称</FormLabel>
              <FormControl>
                <Input
                  placeholder="llama3.2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
