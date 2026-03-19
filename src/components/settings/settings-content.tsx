import { ApiConfigList, type ApiConfigListRef } from './api-config-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useRef } from 'react';

export function SettingsContent() {
  const apiConfigListRef = useRef<ApiConfigListRef>(null);

  return (
    <div className="py-4">
      <Tabs defaultValue="api" className="w-full">
        <TabsList>
          <TabsTrigger value="api">API配置</TabsTrigger>
          <TabsTrigger value="general">通用</TabsTrigger>
        </TabsList>
        <Separator className="my-4" />
        <TabsContent value="api">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-lg">API配置</h3>
            <Button size="sm" onClick={() => apiConfigListRef.current?.startAdding()}>
              <IconPlus className="mr-1 h-4 w-4" />
              添加配置
            </Button>
          </div>
          <ScrollArea className="h-[300px]">
            <ApiConfigList ref={apiConfigListRef} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="general">
          <p className="py-4 text-muted-foreground">通用设置暂未实现</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
