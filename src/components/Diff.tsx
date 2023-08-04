import React, {memo, useEffect, useRef, useState} from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import S from "./Editor.module.css";
import {debounce} from "../utils/debounce";

type Props = {
    isInline: boolean
    originalValue: string
    currentValue: string
    onChange(text: string): void
    language?: 'json' | 'text/plain'
}
export const Diff = memo(({ isInline, originalValue, currentValue, onChange, language = 'text/plain' }: Props) => {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneDiffEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor;

                const original = monaco.editor.createModel(
                    originalValue,
                    language
                );
                const modified = monaco.editor.createModel(
                    currentValue,
                    language
                );

                const diffEditor = monaco.editor.createDiffEditor(
                    monacoEl.current!,
                    {
                        originalEditable: false,
                        automaticLayout: true,
                        renderSideBySide: !isInline,
                    }
                );
                diffEditor.setModel({ original, modified,});
                diffEditor.onDidUpdateDiff(debounce(() => {
                    onChange(modified.getValue())
                }, 50))

                return diffEditor;
            });
        }

        return () => editor?.dispose();
    }, []);

    // Change inline mode
    useEffect(() => {
        editor?.updateOptions({
            renderSideBySide: !isInline,
        })
    }, [isInline])

    // Update models after save
    useEffect(() => {
        if (originalValue === currentValue) {
            const original = monaco.editor.createModel(
                originalValue,
                language
            );
            const modified = monaco.editor.createModel(
                currentValue,
                language
            );
            editor?.setModel({ original, modified });
        }
    }, [originalValue])

    return (
        <div className={S.editor} ref={monacoEl}></div>
    );
});