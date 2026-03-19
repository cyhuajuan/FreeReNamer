import type { RuleCommonInfo, RuleDefine } from './base';

export const RULE_AI_TYPE = 'ai';

export interface RuleAiInfo extends RuleCommonInfo {
  apiConfigId: string;
  prompt: string;
  generatedScript: string;
}

export const RULE_AI_DEFINE: RuleDefine<typeof RULE_AI_TYPE, RuleAiInfo> = {
  type: RULE_AI_TYPE,
  label: 'AI',
  getDefaultInfo: () => ({
    apiConfigId: '',
    prompt: '',
    generatedScript: '',
    includeExt: true,
  }),
  getDescription: (info: RuleAiInfo) => {
    return info.prompt || 'AI规则';
  },
  exec: async (ruleInfo: RuleAiInfo, args) => {
    if (ruleInfo.generatedScript) {
      return new Function('args', ruleInfo.generatedScript)(args);
    }
    throw new Error('请先生成脚本');
  },
};
