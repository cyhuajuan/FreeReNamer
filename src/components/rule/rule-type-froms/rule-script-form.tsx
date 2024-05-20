import type { RULE_SCRIPT_TYPE, Rule, RuleScriptInfo } from '@/lib/rule';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEffect, useRef, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import './rule-script-form-worker';
import classes from './rule-script-form.module.css';

const RuleScriptForm: FC = () => {
  const form = useFormContext<Rule<typeof RULE_SCRIPT_TYPE, RuleScriptInfo>>();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>();
  const monacoEl = useRef<HTMLDivElement>(null);
  const initValue = form.getValues('info.script');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    editorRef.current = monaco.editor.create(monacoEl.current!, {
      value: initValue,
      language: 'javascript',
    });

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const listener = editorRef.current?.onDidChangeModelContent(() => {
      const value = editorRef.current?.getValue();

      if (value) {
        form.setValue('info.script', value);
      }
    });

    return () => {
      listener?.dispose();
    };
  }, [form.setValue]);

  return (
    <div className="size-full">
      <div ref={monacoEl} className={classes.editor} />
    </div>
  );
};

export default RuleScriptForm;
