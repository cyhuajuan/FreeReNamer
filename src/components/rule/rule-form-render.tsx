import { RuleType } from '@/lib/rule';
import type { FC } from 'react';
import { RuleReplaceForm } from './rule-type-froms/rule-replace-form';
import { RuleDeleteForm } from './rule-type-froms/rule-delete-form';
import { RuleScriptForm } from './rule-type-froms/rule-script-form';

export interface RuleFormRenderProps {
  type: RuleType;
}

export const RuleFormRender: FC<RuleFormRenderProps> = ({ type }) => {
  switch (type) {
    case RuleType.Replace:
      return <RuleReplaceForm />;

    case RuleType.Delete:
      return <RuleDeleteForm />;

    case RuleType.Script:
      return <RuleScriptForm />;

    default:
      return null;
  }
};
