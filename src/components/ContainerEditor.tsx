import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Diff} from "./Diff";
import S from "./Editor.module.css";
import {Editor} from "./Editor";
import * as monaco from "monaco-editor";

export function ContainerEditor() {
    const [isDiff, setIsDiff] = useState(false)
    const [isInlineDiff, setIsInlineDiff] = useState(false)
    const [fullscreenToggle, setFullscreenToggle] = useState(false)
    const [savedText, setSavedText] = useState('{}')
    const textRef = useRef(savedText);

    // Auto theme
    useEffect(() => {
        const matchDarkTheme = window.matchMedia('(prefers-color-scheme:dark)')
        if (matchDarkTheme.matches) {
            monaco.editor.setTheme('vs-dark')
        }
        matchDarkTheme.addEventListener('change',(e) => {
            const theme = e.matches? 'vs-dark' : 'vs-light'
            monaco.editor.setTheme(theme)
        })
    }, [])
    const handleFullscreenClick = () => {
        setFullscreenToggle((prev) => !prev);
    }

    const toggleMode = () => {
        setIsDiff(prevState => !prevState)
    }

    const toggleInline = () => {
        setIsInlineDiff(prevState => !prevState);
    }

    const save = () => {
        alert(`Saved: ${textRef.current}`);
        setSavedText(textRef.current)
    }

    const setCurrentText = useCallback((text: string) => {
        textRef.current = text;
    }, []);

    return (
        <div className={S.containerEditor} data-fullscreen={fullscreenToggle}>
            <nav className={S.menu}>
                <button onClick={save} >Save</button>
                <button onClick={handleFullscreenClick} >Fullscreen</button>
                <button onClick={toggleMode}>{isDiff ? 'Show code' : 'Show diff'}</button>
                {isDiff &&
                    <div>
                        <input type="checkbox" checked={isInlineDiff} onChange={toggleInline}/>
                        <label> Inline</label>
                    </div>
                }
            </nav>
            {isDiff
                ? <Diff
                    isInline={isInlineDiff}
                    originalValue={savedText}
                    currentValue={textRef.current}
                    onChange={setCurrentText}
                    language="json"
                />
                : <Editor
                    currentValue={textRef.current}
                    onChange={setCurrentText}
                    language="json"
                />
            }
        </div>
    );
}