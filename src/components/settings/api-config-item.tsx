import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ApiConfig } from '@/lib/settings/ai-config';

interface ApiConfigItemProps {
  config: ApiConfig;
  onEdit: (config: ApiConfig) => void;
  onDelete: (id: string) => void;
}

export function ApiConfigItem({ config, onEdit, onDelete }: ApiConfigItemProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{config.name || '未命名'}</span>
            <span className="rounded bg-secondary px-2 py-0.5 text-xs">
              {config.type === 'ollama' ? 'Ollama' : 'OpenAI'}
            </span>
          </div>
          <div className="text-muted-foreground text-sm">
            {config.baseUrl} / {config.model}
          </div>
          {config.type === 'openai' && config.apiKey && (
            <div className="text-muted-foreground text-xs">密钥: {'*'.repeat(8)}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(config)}>
            <IconPencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(config.id)}>
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
