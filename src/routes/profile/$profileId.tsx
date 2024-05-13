import { FilesPanel } from '@/components/file/files-panel';
import { RulesPanel } from '@/components/rule/rules-panel';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/$profileId')({
  component: Component,
});

function Component() {
  const { profileId } = Route.useParams();

  return (
    <div className="flex size-full flex-col gap-y-2 px-4 py-2">
      <fieldset className="h-1/2 w-full rounded border p-4 pt-2">
        <legend className="font-bold text-sm">操作文件</legend>
        <FilesPanel profileId={profileId} />
      </fieldset>
      <fieldset className="h-1/2 w-full rounded border p-4 pt-2">
        <legend className="font-bold text-sm">处理规则</legend>
        <RulesPanel profileId={profileId} />
      </fieldset>
    </div>
  );
}
