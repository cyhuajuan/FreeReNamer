import { escapeRegExp } from 'lodash-es';
import type { RuleCommonInfo, RuleDefine, RuleMatchInfo } from './base';

export const RULE_REPLACE_TYPE = 'replace';

export interface RuleReplaceInfo extends RuleMatchInfo, RuleCommonInfo {
  replace: string;
}

export const RULE_REPLACE_DEFINE: RuleDefine<
  typeof RULE_REPLACE_TYPE,
  RuleReplaceInfo
> = {
  type: RULE_REPLACE_TYPE,
  label: '替换',
  getDefaultInfo: () => {
    return {
      match: '',
      replace: '',
      useRegExp: false,
      caseSensitive: false,
      matchAll: false,
      includeExt: false,
    };
  },
  getDescription: (ruleInfo) => {
    return `${ruleInfo.match} 替换为 ${ruleInfo.replace}`;
  },
  exec: async (ruleInfo, args) => {
    const { match, replace, useRegExp, matchAll, caseSensitive, includeExt } =
      ruleInfo;
    const { fileInfo } = args;
    const fileName = includeExt ? fileInfo.fullName : fileInfo.name;

    return fileName.replace(
      new RegExp(
        useRegExp ? match : escapeRegExp(match),
        `${caseSensitive ? '' : 'i'}${matchAll ? 'g' : ''}`,
      ),
      replace,
    );
  },
};
