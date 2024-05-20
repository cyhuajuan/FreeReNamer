import type { RuleCommonInfo, RuleDefine } from './base';

export const RULE_INSERT_TYPE = 'insert';

export enum RuleInsertType {
  Prefix = 'prefix',
  Suffix = 'suffix',
}

export const RULE_INSERT_TYPES = Object.values(RuleInsertType);

export const RULE_INSET_TYPE_LABELS = {
  [RuleInsertType.Prefix]: '前缀',
  [RuleInsertType.Suffix]: '后缀',
};

export interface RuleInsertInfo extends RuleCommonInfo {
  type: RuleInsertType;
  content: string;
}

export const RULE_INSERT_DEFINE: RuleDefine<
  typeof RULE_INSERT_TYPE,
  RuleInsertInfo
> = {
  type: RULE_INSERT_TYPE,
  label: '插入',
  getDefaultInfo: () => {
    return {
      type: RuleInsertType.Prefix,
      content: '',
      includeExt: false,
    };
  },
  getDescription: (ruleInfo: RuleInsertInfo) => {
    return `在${RULE_INSET_TYPE_LABELS[ruleInfo.type]}插入 ${ruleInfo.content}`;
  },
  exec: async (ruleInfo, args) => {
    const { fileInfo } = args;

    switch (ruleInfo.type) {
      case RuleInsertType.Prefix: {
        return `${ruleInfo.content}${fileInfo.name}`;
      }

      case RuleInsertType.Suffix: {
        return `${fileInfo.name}${ruleInfo.content}`;
      }
    }
  },
};
