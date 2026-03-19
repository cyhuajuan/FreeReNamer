import { z } from 'zod';
import { nanoid } from 'nanoid';

export const API_CONFIG_TYPES = ['ollama', 'openai'] as const;
export type ApiConfigType = (typeof API_CONFIG_TYPES)[number];

export const ApiConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '配置名称不能为空'),
  type: z.enum(['ollama', 'openai']),
  baseUrl: z.string().url('请输入有效的URL'),
  model: z.string().min(1, '模型名称不能为空'),
  apiKey: z.string().optional(),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;

export function getDefaultApiConfig(type: ApiConfigType = 'ollama'): ApiConfig {
  const base: ApiConfig = {
    id: nanoid(),
    name: '',
    type,
    baseUrl: type === 'ollama' ? 'http://localhost:11434' : 'https://api.openai.com/v1',
    model: type === 'ollama' ? 'llama3.2' : 'gpt-4o-mini',
    apiKey: type === 'openai' ? '' : undefined,
  };

  return base;
}
