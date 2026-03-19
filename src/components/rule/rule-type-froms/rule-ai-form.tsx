import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { getAiConfigList, getAiConfig } from '@/lib/settings/ai-config-store';
import { QueryType } from '@/lib/query';
import type { RULE_AI_TYPE, RuleAiInfo, Rule } from '@/lib/rules';
import type { FC } from 'react';
import { useState } from 'react';
import { chat } from '@/lib/ai-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SCRIPT_TEMPLATE = `const { fileInfo, index } = args;

// your code here
return fileInfo.name + "_backup" + fileInfo.ext;
`;

export const RuleAiForm: FC = () => {
  const form = useFormContext<Rule<typeof RULE_AI_TYPE, RuleAiInfo>>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: apiConfigs = [] } = useQuery({
    queryKey: [QueryType.AiConfigList],
    queryFn: getAiConfigList,
  });

  async function handleGenerate() {
    const apiConfigId = form.getValues('info.apiConfigId');
    const prompt = form.getValues('info.prompt');

    if (!apiConfigId) {
      setError('请选择API配置');
      return;
    }
    if (!prompt) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const apiConfig = await getAiConfig(apiConfigId);
      if (!apiConfig) {
        setError('未找到API配置');
        return;
      }

      const systemPrompt = `你是一个文件重命名助手。用户会提供一个提示词，你需要生成一段JavaScript代码来对文件名进行重命名。

生成代码的规则：
1. 代码必须是一个完整的JavaScript代码块
2. 可以使用 args 对象中的 fileInfo（包含 name, ext, fullName）和 index
3. fileInfo.fullName 包含完整文件名（带扩展名），fileInfo.name 是不带扩展名的文件名
4. 返回值是完整的新文件名（需要包含扩展名）
5. 不要包含任何解释性文字，只返回代码

示例代码模板：
${SCRIPT_TEMPLATE}`;

      const response = await chat(apiConfig, [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ]);

      form.setValue('info.generatedScript', response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        control={form.control}
        name="info.apiConfigId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API配置</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="选择API配置" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {apiConfigs.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    {config.name || config.type} - {config.baseUrl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="info.prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>提示词</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="例如：在文件名前添加序号，如 01_、02_"
                rows={3}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? '生成中...' : '生成脚本'}
      </Button>

      <FormField
        control={form.control}
        name="info.generatedScript"
        render={({ field }) => (
          <FormItem>
            <FormLabel>生成的脚本</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="生成的脚本将显示在这里，可以手动修改"
                rows={6}
                className="font-mono text-sm"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default RuleAiForm;
