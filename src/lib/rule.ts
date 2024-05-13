import { nanoid } from 'nanoid';
import { getFileInfo, type FileInfo } from './file';

export enum RuleType {
  Replace = 'replace',
  Delete = 'delete',
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

export interface RuleScriptInfo extends RuleCommonInfo {
  script: string;
}

export type RuleInfo = {
  [RuleType.Replace]: RuleReplaceInfo;
  [RuleType.Delete]: RuleDeleteInfo;
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

export interface RuleScript extends RuleBase {
  type: RuleType.Script;
  info: RuleScriptInfo;
}

export type Rule = RuleReplace | RuleDelete | RuleScript;

export const RULE_TYPES = Object.values(RuleType);

export const RULE_TYPE_LABELS = {
  [RuleType.Replace]: '替换',
  [RuleType.Delete]: '删除',
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

    case RuleType.Script:
      return {
        script:
          'const { fileInfo, index } = args;\n\n// some code \n\nreturn fileInfo.name;\n',
        includeExt: false,
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

      if (useRegExp) {
        return fileName.replace(
          new RegExp(
            match,
            `${caseSensitive ? '' : 'i'}${matchAll ? 'g' : ''}`,
          ),
          replace,
        );
      }

      return fileName.replace(match, replace);
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

    case RuleType.Script:
      return '自定义脚本';
  }
}
