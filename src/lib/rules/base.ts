import type { FileInfo } from '../file';

export interface RuleCommonInfo {
  includeExt: boolean;
}

export interface RuleMatchInfo {
  match: string;
  useRegExp: boolean;
  caseSensitive: boolean;
  matchAll: boolean;
}

export interface RuleBase {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Rule<
  T extends string = string,
  I extends RuleCommonInfo = RuleCommonInfo,
> extends RuleBase {
  type: T;
  info: I;
}

export interface ExecRuleArgs {
  fileInfo: FileInfo;
  index: number;
}

export interface RuleDefine<
  T extends string = string,
  I extends RuleCommonInfo = RuleCommonInfo,
> {
  type: T;
  label: string;
  getDefaultInfo(): I;
  getDescription(ruleInfo: I): string;
  exec(ruleInfo: I, args: ExecRuleArgs): Promise<string>;
}

export const ruleDefineDict: Record<string, RuleDefine> = {};

export function defineRule(ruleDefine: RuleDefine) {
  ruleDefineDict[ruleDefine.type] = ruleDefine;
}
