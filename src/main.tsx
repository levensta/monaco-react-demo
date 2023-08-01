import React from 'react';
import { createRoot } from 'react-dom/client';
import { Editor } from './components/Editor';
import './userWorker';

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<Editor />
	</React.StrictMode>,
);
