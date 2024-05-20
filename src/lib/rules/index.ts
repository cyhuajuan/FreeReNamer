export * from './base';
export * from './replace';
export * from './delete';
export * from './format';
export * from './template';
export * from './script';

import { defineRule } from './base';
import { RULE_REPLACE_DEFINE } from './replace';
import { RULE_DELETE_DEFINE } from './delete';
import { RULE_FORMAT_DEFINE } from './format';
import { RULE_TEMPLATE_DEFINE } from './template';
import { RULE_SCRIPT_DEFINE } from './script';

defineRule(RULE_REPLACE_DEFINE);
defineRule(RULE_DELETE_DEFINE);
defineRule(RULE_FORMAT_DEFINE);
defineRule(RULE_TEMPLATE_DEFINE);
defineRule(RULE_SCRIPT_DEFINE);
