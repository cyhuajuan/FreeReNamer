import { memoize, template } from 'lodash-es';
import type { RuleCommonInfo, RuleDefine } from './base';

export const RULE_TEMPLATE_TYPE = 'template';

export interface RuleTemplateInfo extends RuleCommonInfo {
  template: string;
}

export const memoTemplate = memoize((content: string) => template(content));

export const RULE_TEMPLATE_DEFINE: RuleDefine<
  typeof RULE_TEMPLATE_TYPE,
  RuleTemplateInfo
> = {
  type: RULE_TEMPLATE_TYPE,
  label: '模板',
  getDefaultInfo: () => ({
    template: '',
    includeExt: false,
  }),
  getDescription: (ruleInfo) => {
    return `转为 ${ruleInfo.template}`;
  },
  exec: async (ruleInfo, args) => {
    return memoTemplate(ruleInfo.template)(args);
  },
};
