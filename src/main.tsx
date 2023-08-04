import React from 'react';
import { createRoot } from 'react-dom/client';
import { ContainerEditor } from './components/ContainerEditor';
import './userWorker';

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<ContainerEditor />
	</React.StrictMode>,
);
