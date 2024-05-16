import { nanoid } from 'nanoid';
import {
  capitalize,
  escapeRegExp,
  kebabCase,
  lowerCase,
  lowerFirst,
  snakeCase,
  startCase,
  toLower,
  toUpper,
  upperCase,
  upperFirst,
} from 'lodash-es';
import { getFileInfo, type FileInfo } from './file';

export enum RuleType {
  Replace = 'replace',
  Delete = 'delete',
  Format = 'format',
  Script = 'script',
}

export interface RuleMatchInfo {
  match: string;
  useRegExp: boolean;
  caseSensitive: boolean;
  matchAll: boolean;
}

export interface RuleCommonInfo {
  includeExt: boolean;
}

export interface RuleReplaceInfo extends RuleMatchInfo, RuleCommonInfo {
  replace: string;
}

export interface RuleDeleteInfo extends RuleMatchInfo, RuleCommonInfo {}

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

export interface RuleScriptInfo extends RuleCommonInfo {
  script: string;
}

export type RuleInfo = {
  [RuleType.Replace]: RuleReplaceInfo;
  [RuleType.Delete]: RuleDeleteInfo;
  [RuleType.Format]: RuleFormatInfo;
  [RuleType.Script]: RuleScriptInfo;
};

export interface RuleBase {
  id: string;
  name: string;
  enabled: boolean;
}

export interface RuleReplace extends RuleBase {
  type: RuleType.Replace;
  info: RuleReplaceInfo;
}

export interface RuleDelete extends RuleBase {
  type: RuleType.Delete;
  info: RuleDeleteInfo;
}

export interface RuleFormat extends RuleBase {
  type: RuleType.Format;
  info: RuleFormatInfo;
}

export interface RuleScript extends RuleBase {
  type: RuleType.Script;
  info: RuleScriptInfo;
}

export type Rule = RuleReplace | RuleDelete | RuleFormat | RuleScript;

export const RULE_TYPES = Object.values(RuleType);

export const RULE_TYPE_LABELS = {
  [RuleType.Replace]: '替换',
  [RuleType.Delete]: '删除',
  [RuleType.Format]: '格式化',
  [RuleType.Script]: '脚本',
};

export function getRuleTypeDefaultInfo<T extends RuleType>(
  type: T,
): RuleInfo[T] {
  switch (type) {
    case RuleType.Replace:
      return {
        match: '',
        replace: '',
        useRegExp: false,
        caseSensitive: false,
        matchAll: false,
        includeExt: false,
      } satisfies RuleReplaceInfo as RuleInfo[T];

    case RuleType.Delete:
      return {
        match: '',
        useRegExp: false,
        caseSensitive: false,
        matchAll: false,
        includeExt: false,
      } satisfies RuleDeleteInfo as RuleInfo[T];

    case RuleType.Format:
      return {
        type: RuleFormatType.Capitalize,
        includeExt: false,
      } satisfies RuleFormatInfo as RuleInfo[T];

    case RuleType.Script:
      return {
        script:
          'const { fileInfo, index } = args;\n\n// some code \n\nreturn fileInfo.name;\n',
        includeExt: true,
      } satisfies RuleScriptInfo as RuleInfo[T];
  }

  throw new Error('Unknown rule type');
}

export interface ExecRuleArgs {
  fileInfo: FileInfo;
  index: number;
}

export async function _execRule(
  rule: Rule,
  args: ExecRuleArgs,
): Promise<string> {
  const { fileInfo } = args;

  switch (rule.type) {
    case RuleType.Replace: {
      const { match, replace, useRegExp, matchAll, caseSensitive, includeExt } =
        rule.info;
      const fileName = includeExt ? fileInfo.fullName : fileInfo.name;

      return fileName.replace(
        new RegExp(
          useRegExp ? match : escapeRegExp(match),
          `${caseSensitive ? '' : 'i'}${matchAll ? 'g' : ''}`,
        ),
        replace,
      );
    }

    case RuleType.Delete: {
      return execRule(
        {
          ...rule,
          type: RuleType.Replace,
          info: {
            ...rule.info,
            replace: '',
          },
        },
        args,
      );
    }

    case RuleType.Format: {
      switch (rule.info.type) {
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
    }

    case RuleType.Script: {
      return new Function('args', rule.info.script)(args);
    }
  }
}

export async function execRule(
  rule: Rule,
  args: ExecRuleArgs,
): Promise<string> {
  const result = await _execRule(rule, args);

  return `${result.trim()}${rule.info.includeExt ? '' : args.fileInfo.ext}`;
}

export async function execRules(
  rules: Rule[],
  args: ExecRuleArgs,
): Promise<string> {
  if (rules.length === 0) {
    return args.fileInfo.fullName;
  }

  const rule = rules[0];
  const result = await execRule(rule, args);
  const newFileInfo = await getFileInfo(result);

  return execRules(rules.slice(1), { ...args, fileInfo: newFileInfo });
}

export function getRuleTypeDefaultValue(
  ruleType: RuleType = RuleType.Replace,
): Rule {
  return {
    id: nanoid(),
    type: ruleType,
    info: getRuleTypeDefaultInfo(ruleType),
    name: '',
    enabled: true,
  } as Rule;
}

export function getRuleDescription(rule: Rule): string {
  switch (rule.type) {
    case RuleType.Replace:
      return `${rule.info.match} 替换为 ${rule.info.replace}`;

    case RuleType.Delete:
      return `删除 ${rule.info.match}`;

    case RuleType.Format:
      switch (rule.info.type) {
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

    case RuleType.Script:
      return '自定义脚本';
  }
}
