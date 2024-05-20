import type { RuleCommonInfo, RuleDefine } from './base';

export const RULE_SCRIPT_TYPE = 'script';

export interface RuleScriptInfo extends RuleCommonInfo {
  script: string;
}

export const RULE_SCRIPT_DEFINE: RuleDefine<
  typeof RULE_SCRIPT_TYPE,
  RuleScriptInfo
> = {
  type: RULE_SCRIPT_TYPE,
  label: '脚本',
  getDefaultInfo: () => ({
    script:
      'const { fileInfo, index } = args;\n\n// some code \n\nreturn fileInfo.name;\n',
    includeExt: true,
  }),
  getDescription: () => {
    return '自定义脚本';
  },
  exec: async (ruleInfo, args) => {
    return new Function('args', ruleInfo.script)(args);
  },
};
