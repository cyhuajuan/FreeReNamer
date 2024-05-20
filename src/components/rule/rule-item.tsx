import { getRuleDefine, type Rule } from '@/lib/rule';
import { useMemo, type FC } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { Switch } from '../ui/switch';

export interface RuleItemProps {
  rule: Rule;
  onDel?: () => void;
  onSwitch?: (checked: boolean) => void;
  onEdit?: () => void;
}

export const RuleItem: FC<RuleItemProps> = ({
  rule,
  onDel,
  onSwitch,
  onEdit,
}) => {
  const label = useMemo(() => {
    return getRuleDefine(rule.type).label;
  }, [rule.type]);

  const description = useMemo(() => {
    return getRuleDefine(rule.type).getDescription(rule.info);
  }, [rule.type, rule.info]);

  function handleDel() {
    onDel?.();
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="grid min-h-8 w-full grid-cols-[25%_100px_1fr_3rem] divide-x break-all text-sm hover:bg-neutral-100">
          <span className="flex size-full items-center px-2 py-1">
            <span>{rule.name}</span>
          </span>
          <span className="flex size-full items-center justify-center px-2 py-1">
            {label}
          </span>
          <span className="flex size-full items-center px-2 py-1">
            {description}
          </span>
          <div className="flex size-full items-center justify-center">
            <Switch checked={rule.enabled} onCheckedChange={onSwitch} />
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit}>编辑</ContextMenuItem>
        <ContextMenuItem onClick={handleDel}>删除</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
