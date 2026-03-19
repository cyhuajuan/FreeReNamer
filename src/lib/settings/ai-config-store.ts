import { store } from '@/lib/store';
import { QueryType } from '@/lib/query';
import type { ApiConfig } from './ai-config';

export async function getAiConfigList(): Promise<ApiConfig[]> {
  return (await store.get<ApiConfig[]>(QueryType.AiConfigList)) ?? [];
}

export async function setAiConfigList(configs: ApiConfig[]): Promise<void> {
  await store.set(QueryType.AiConfigList, configs);
}

export async function addAiConfig(config: ApiConfig): Promise<void> {
  const configs = await getAiConfigList();
  configs.push(config);
  await setAiConfigList(configs);
}

export async function updateAiConfig(id: string, updated: ApiConfig): Promise<void> {
  const configs = await getAiConfigList();
  const index = configs.findIndex((c) => c.id === id);
  if (index !== -1) {
    configs[index] = updated;
    await setAiConfigList(configs);
  }
}

export async function deleteAiConfig(id: string): Promise<void> {
  const configs = await getAiConfigList();
  await setAiConfigList(configs.filter((c) => c.id !== id));
}
