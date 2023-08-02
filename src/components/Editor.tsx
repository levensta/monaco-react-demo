import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import S from './Editor.module.css';

export function Editor() {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const [fullscreenToggle, setFullscreenToggle] = useState(false)
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl) {
			setEditor((editor) => {
				if (editor) return editor;

				return monaco.editor.create(monacoEl.current!, {
					value: '{}',
					language: 'json',
					automaticLayout: true,
				});
			});
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	// Auto theme
	useEffect(() => {
		const matchDarkTheme = window.matchMedia('(prefers-color-scheme:dark)')
		if (matchDarkTheme.matches) {
			monaco.editor.setTheme('vs-dark')
		}
		matchDarkTheme.addEventListener('change',(e) => {
			const theme = e.matches? 'vs-dark' : 'light'
			monaco.editor.setTheme(theme)
		})
	}, [])

	const handleFullscreenClick = () => {
		setFullscreenToggle((prev) => !prev);
	}

	const sendValue = () => {
		const value = editor?.getValue();
		alert(`Sended: ${value}`);
	}

	return (
		<div className={S.containerEditor} data-fullscreen={fullscreenToggle}>
			<nav className={S.menu}>
				<button onClick={sendValue}>Send</button>
				<button onClick={handleFullscreenClick} >Fullscreen</button>
			</nav>
			<div className={S.editor} ref={monacoEl}>
			</div>
		</div>
	);
}
