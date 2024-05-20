import {
  capitalize,
  kebabCase,
  snakeCase,
  startCase,
  upperCase,
  lowerCase,
  toLower,
  toUpper,
  lowerFirst,
  upperFirst,
} from 'lodash-es';
import type { RuleCommonInfo, RuleDefine } from './base';

export const RULE_FORMAT_TYPE = 'format';

export enum RuleFormatType {
  Capitalize = 'capitalize',
  UpperFirst = 'upper-first',
  LowerFirst = 'lower-first',
  KebabCase = 'kebab-case',
  LowerCase = 'lower-case',
  SnakeCase = 'snake-case',
  StartCase = 'start-case',
  UpperCase = 'upper-case',
  Lower = 'lower',
  Upper = 'upper',
}

export const RULE_FORMAT_TYPES = Object.values(RuleFormatType);

export const RULE_FORMAT_TYPE_LABELS = {
  [RuleFormatType.Capitalize]: '首字母大写其它小写 (capitalize)',
  [RuleFormatType.UpperFirst]: '首字母大写 (upper-first)',
  [RuleFormatType.LowerFirst]: '首字母小写 (lower-first)',
  [RuleFormatType.KebabCase]: '单词以-分隔 (kebab-case)',
  [RuleFormatType.LowerCase]: '单词以空格分隔并且转小写 (lower-case)',
  [RuleFormatType.SnakeCase]: '单词以_分隔 (snake-case)',
  [RuleFormatType.StartCase]: '单词以空格分割并且首字母转大写 (start-case)',
  [RuleFormatType.UpperCase]: '单词以空格分隔并且转大写 (upper-case)',
  [RuleFormatType.Lower]: '转小写 (lower)',
  [RuleFormatType.Upper]: '转大写 (upper)',
};

export interface RuleFormatInfo extends RuleCommonInfo {
  type: RuleFormatType;
}

export const RULE_FORMAT_DEFINE: RuleDefine<
  typeof RULE_FORMAT_TYPE,
  RuleFormatInfo
> = {
  type: RULE_FORMAT_TYPE,
  label: '格式化',
  getDefaultInfo: () => ({
    type: RuleFormatType.Capitalize,
    includeExt: false,
  }),
  getDescription: (ruleInfo) => {
    switch (ruleInfo.type) {
      case RuleFormatType.Capitalize:
        return '转为首字母大写其它小写';

      case RuleFormatType.KebabCase:
        return '转为单词以-分隔';

      case RuleFormatType.SnakeCase:
        return '转为单词以_分隔';

      case RuleFormatType.StartCase:
        return '转为单词以空格分割并且首字母转大写';

      case RuleFormatType.UpperCase:
        return '转为单词以空格分隔并且转大写';

      case RuleFormatType.LowerCase:
        return '转为单词以空格分隔并且转小写';

      case RuleFormatType.Lower:
        return '转为小写';

      case RuleFormatType.Upper:
        return '转为大写';

      case RuleFormatType.LowerFirst:
        return '转为首字母小写';

      case RuleFormatType.UpperFirst:
        return '转为首字母大写';

      default:
        return '格式化';
    }
  },
  exec: async (ruleInfo, args) => {
    const { fileInfo } = args;

    switch (ruleInfo.type) {
      case RuleFormatType.Capitalize: {
        return capitalize(fileInfo.name);
      }

      case RuleFormatType.KebabCase: {
        return kebabCase(fileInfo.name);
      }

      case RuleFormatType.SnakeCase: {
        return snakeCase(fileInfo.name);
      }

      case RuleFormatType.StartCase: {
        return startCase(fileInfo.name);
      }

      case RuleFormatType.UpperCase: {
        return upperCase(fileInfo.name);
      }

      case RuleFormatType.LowerCase: {
        return lowerCase(fileInfo.name);
      }

      case RuleFormatType.Lower: {
        return toLower(fileInfo.name);
      }

      case RuleFormatType.Upper: {
        return toUpper(fileInfo.name);
      }

      case RuleFormatType.LowerFirst: {
        return lowerFirst(fileInfo.name);
      }

      case RuleFormatType.UpperFirst: {
        return upperFirst(fileInfo.name);
      }

      default: {
        throw new Error('Unknown rule format type');
      }
    }
  },
};
