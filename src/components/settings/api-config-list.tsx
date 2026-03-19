import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAiConfigList, addAiConfig, updateAiConfig, deleteAiConfig } from '@/lib/settings/ai-config-store';
import { ApiConfigItem } from './api-config-item';
import { ApiConfigForm } from './api-config-form';
import type { ApiConfig } from '@/lib/settings/ai-config';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { QueryType } from '@/lib/query';

export interface ApiConfigListRef {
  startAdding: () => void;
}

export const ApiConfigList = forwardRef<ApiConfigListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { data: configs = [], isLoading } = useQuery({
    queryKey: [QueryType.AiConfigList],
    queryFn: getAiConfigList,
  });

  const { mutate: handleAdd } = useMutation({
    mutationFn: addAiConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryType.AiConfigList] });
    },
  });

  const { mutate: handleUpdate } = useMutation({
    mutationFn: ({ id, config }: { id: string; config: ApiConfig }) =>
      updateAiConfig(id, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryType.AiConfigList] });
    },
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteAiConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryType.AiConfigList] });
    },
  });

  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useImperativeHandle(ref, () => ({
    startAdding: () => setIsAdding(true),
  }));

  if (isLoading) {
    return <div className="py-4 text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {(isAdding || editingConfig) && (
        <div className="rounded-lg border bg-card p-4">
          <ApiConfigForm
            defaultValues={editingConfig ?? undefined}
            onSubmit={(values) => {
              if (editingConfig) {
                handleUpdate({ id: editingConfig.id, config: values });
                setEditingConfig(null);
              } else {
                handleAdd(values);
                setIsAdding(false);
              }
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingConfig(null);
            }}
            submitLabel={editingConfig ? '更新' : '添加'}
          />
        </div>
      )}

      <div className="space-y-2">
        {configs.length === 0 && !isAdding && (
          <p className="py-8 text-center text-muted-foreground">
            暂无API配置，点击"添加配置"开始
          </p>
        )}
        {configs.map((config) => (
          <ApiConfigItem
            key={config.id}
            config={config}
            onEdit={setEditingConfig}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </div>
    </div>
  );
});
