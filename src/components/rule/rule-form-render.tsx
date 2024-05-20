import { Suspense, lazy, type FC } from 'react';
import { RuleReplaceForm } from './rule-type-froms/rule-replace-form';
import { RuleDeleteForm } from './rule-type-froms/rule-delete-form';
import { IconLoader2 } from '@tabler/icons-react';
import { RuleFormatForm } from './rule-type-froms/rule-format-form';
import { RuleTemplateForm } from './rule-type-froms/rule-template-form';
import {
  RULE_DELETE_TYPE,
  RULE_FORMAT_TYPE,
  RULE_REPLACE_TYPE,
  RULE_SCRIPT_TYPE,
  RULE_TEMPLATE_TYPE,
} from '@/lib/rules';

const RuleScriptForm = lazy(() => import('./rule-type-froms/rule-script-form'));

export interface RuleFormRenderProps {
  type: string;
}

export const RuleFormRender: FC<RuleFormRenderProps> = ({ type }) => {
  switch (type) {
    case RULE_REPLACE_TYPE:
      return <RuleReplaceForm />;

    case RULE_DELETE_TYPE:
      return <RuleDeleteForm />;

    case RULE_FORMAT_TYPE:
      return <RuleFormatForm />;

    case RULE_SCRIPT_TYPE:
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

    case RULE_TEMPLATE_TYPE:
      return <RuleTemplateForm />;

    default:
      return null;
  }
};
