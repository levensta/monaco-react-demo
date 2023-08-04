import {useRef, useState, useEffect, memo} from 'react';
import {debounce} from '../utils/debounce';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import S from './Editor.module.css';

type Props = {
	currentValue: string;
	onChange(text: string): void
	language: string
}

export const Editor = memo(function Editor({currentValue, onChange, language}: Props) {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl) {
			setEditor((editor) => {
				if (editor) return editor;

				const codeEditor = monaco.editor.create(monacoEl.current!, {
					value: currentValue,
					language,
					automaticLayout: true,
				});
				codeEditor.onDidChangeModelContent(debounce(() => {
					onChange(codeEditor.getValue());
				}, 50))
				return codeEditor;
			});
		}

		return () => {
			editor?.dispose()
		};
	}, [monacoEl.current]);

	return (
		<div className={S.editor} ref={monacoEl}/>
	);
});
