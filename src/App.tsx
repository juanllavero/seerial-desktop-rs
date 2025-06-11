import { invoke } from '@tauri-apps/api/core'
import { useEffect } from 'react'

export default function App() {
	useEffect(() => {
		// Embebido MPV cuando el componente se monta
		invoke('embed_mpv').catch(console.error)
	}, [])

	return (
		<div
			style={{
				color: 'white',
				position: 'absolute',
				zIndex: 10,
				top: 10,
				left: 10,
				backgroundColor: 'rgba(0,0,0,0.7)',
				padding: '10px',
				borderRadius: '5px',
			}}
		>
			<h1>MPV Video Controls</h1>
			<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
				<button onClick={() => invoke('play')}>Play</button>
				<button onClick={() => invoke('pause')}>Pause</button>
				<button onClick={() => invoke('stop')}>Stop</button>
			</div>
			<button
				onClick={() =>
					invoke('loadfile', {
						file: 'C:\\Users\\juan_\\Videos\\test.mkv',
					})
				}
			>
				Load Video
			</button>
		</div>
	)
}
