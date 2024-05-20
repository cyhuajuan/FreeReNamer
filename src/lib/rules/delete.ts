import { escapeRegExp } from 'lodash-es';
import type { RuleCommonInfo, RuleDefine, RuleMatchInfo } from './base';

export const RULE_DELETE_TYPE = 'delete';

export interface RuleDeleteInfo extends RuleCommonInfo, RuleMatchInfo {}

export const RULE_DELETE_DEFINE: RuleDefine<
  typeof RULE_DELETE_TYPE,
  RuleDeleteInfo
> = {
  type: RULE_DELETE_TYPE,
  label: '删除',
  getDefaultInfo: () => ({
    match: '',
    useRegExp: false,
    caseSensitive: false,
    matchAll: false,
    includeExt: false,
  }),
  getDescription: (ruleInfo) => {
    return `删除 ${ruleInfo.match}`;
  },
  exec: async (ruleInfo, args) => {
    const { match, useRegExp, caseSensitive, matchAll, includeExt } = ruleInfo;
    const { fileInfo } = args;
    const fileName = includeExt ? fileInfo.fullName : fileInfo.name;

    return fileName.replace(
      new RegExp(
        useRegExp ? match : escapeRegExp(match),
        `${caseSensitive ? '' : 'i'}${matchAll ? 'g' : ''}`,
      ),
      '',
    );
  },
};
