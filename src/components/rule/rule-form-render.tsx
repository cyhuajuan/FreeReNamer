import { RuleType } from '@/lib/rule';
import { Suspense, lazy, type FC } from 'react';
import { RuleReplaceForm } from './rule-type-froms/rule-replace-form';
import { RuleDeleteForm } from './rule-type-froms/rule-delete-form';
import { IconLoader2 } from '@tabler/icons-react';
import { RuleFormatForm } from './rule-type-froms/rule-format-form';
import { RuleTemplateForm } from './rule-type-froms/rule-template-form';

const RuleScriptForm = lazy(() => import('./rule-type-froms/rule-script-form'));

export interface RuleFormRenderProps {
  type: RuleType;
}

export const RuleFormRender: FC<RuleFormRenderProps> = ({ type }) => {
  switch (type) {
    case RuleType.Replace:
      return <RuleReplaceForm />;

    case RuleType.Delete:
      return <RuleDeleteForm />;

    case RuleType.Format:
      return <RuleFormatForm />;

    case RuleType.Script:
      return (
        <Suspense
          fallback={
            <div className="flex size-full items-center justify-center gap-x-2">
              <IconLoader2 className="animate-spin" />
              <span>正在加载...</span>
            </div>
          }
        >
          <RuleScriptForm />
        </Suspense>
      );

    case RuleType.Template:
      return <RuleTemplateForm />;

    default:
      return null;
  }
};
