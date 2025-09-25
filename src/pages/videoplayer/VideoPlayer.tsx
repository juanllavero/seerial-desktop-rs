import { invoke } from '@tauri-apps/api/core'
import { useEffect, useRef, useState } from 'react'

type Track = [number, string]

export default function VideoPlayer() {
	const [position, setPosition] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(100)
	const [zoom, setZoom] = useState(0)

	const [audioTrack, setAudioTrack] = useState(1)
	const [subtitleTrack, setSubtitleTrack] = useState(1)

	const [audioTracks] = useState<Track[]>([
		[1, 'Audio 1'],
		[2, 'Audio 2'],
	])
	const [subtitleTracks] = useState<Track[]>([
		[0, 'No Subtitles'],
		[1, 'English'],
		[2, 'Spanish'],
	])

	const seeking = useRef(false)

	useEffect(() => {
		invoke('embed_mpv').catch(console.error)
	}, [])

	// Poll de posición cada 500ms, si no estamos haciendo seek manual
	useEffect(() => {
		const interval = setInterval(() => {
			if (!seeking.current) {
				invoke<number>('get_position')
					.then(setPosition)
					.catch(console.error)
			}
		}, 500)
		return () => clearInterval(interval)
	}, [])

	const loadVideo = async () => {
		try {
			await invoke('loadfile', {
				file: 'C:/Users/juan_/Videos/fmab.mkv',
			})
			const dur = await invoke<number>('get_duration')
			const vol = await invoke<number>('get_volume')

			setDuration(dur)
			console.log({ dur })
			setVolume(vol)
			setPosition(0)
		} catch (e) {
			console.error(e)
		}
	}

	const handleSeekStart = () => {
		seeking.current = true
	}

	const handleSeekChange = (value: number) => {
		setPosition(value)
	}

	const handleSeekEnd = async (value: number) => {
		seeking.current = false
		try {
			const currentDur = await invoke<number>('get_duration')
			const clamped = Math.max(0, Math.min(currentDur, value))
			await invoke('set_position', { position: clamped })
			setPosition(clamped)
			setDuration(currentDur)
		} catch (error) {
			console.error('Seek set failed:', error)
		}
	}

	const seekRelative = async (delta: number) => {
		try {
			const currentPos = await invoke<number>('get_position')
			const currentDur = await invoke<number>('get_duration')

			const newPos = Math.max(0, Math.min(currentDur, currentPos + delta))
			await invoke('set_position', { position: newPos })
			setPosition(newPos)
			setDuration(currentDur) // opcional, por si se actualiza
		} catch (error) {
			console.error('Seek failed:', error)
		}
	}

	const handleVolumeChange = async (vol: number) => {
		setVolume(vol)
		await invoke('set_volume', { volume: vol }).catch(console.error)
	}

	const handleZoomChange = async (zoomLevel: number) => {
		setZoom(zoomLevel)
		await invoke('set_zoom', { zoomLevel }).catch(console.error)
	}

	const handleAudioTrack = async (trackId: number) => {
		setAudioTrack(trackId)
		await invoke('set_audio_track', { trackId }).catch(console.error)
	}

	const handleSubtitleTrack = async (trackId: number) => {
		setSubtitleTrack(trackId)
		await invoke('set_subtitle_track', { trackId }).catch(console.error)
	}

	return (
		<div
			style={{
				color: 'white',
				backgroundColor: 'rgba(0,0,0,0.7)',
				padding: '10px',
				borderRadius: '5px',
			}}
			className='absolute top-10 right-10'
		>
			<h1>MPV Video Controls</h1>

			<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
				<button onClick={() => invoke('play')}>Play</button>
				<button onClick={() => invoke('pause')}>Pause</button>
				<button
					onClick={() => {
						invoke('stop')
						invoke('embed_mpv').catch(console.error)
					}}
				>
					Stop
				</button>
			</div>

			<button onClick={loadVideo} style={{ marginBottom: '10px' }}>
				Load Video
			</button>

			<div style={{ marginBottom: '10px' }}>
				<label>Position: </label>
				<input
					type='range'
					min={0}
					max={duration}
					step={0.1}
					value={position}
					onMouseDown={handleSeekStart}
					onTouchStart={handleSeekStart}
					onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
					onMouseUp={(e) =>
						handleSeekEnd(
							parseFloat((e.target as HTMLInputElement).value)
						)
					}
					onTouchEnd={() => handleSeekEnd(position)}
				/>
				<div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
					<button onClick={() => seekRelative(-10)}>-10s</button>
					<span>
						{position.toFixed(1)} / {duration.toFixed(1)}s
					</span>
					<button onClick={() => seekRelative(10)}>+10s</button>
				</div>
			</div>

			<div style={{ marginBottom: '10px' }}>
				<label>Volume: </label>
				<input
					type='range'
					min={0}
					max={100}
					value={volume}
					onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
				/>
				<span> {volume}%</span>
			</div>

			<div style={{ marginBottom: '10px' }}>
				<label>Audio Track: </label>
				<select
					value={audioTrack}
					onChange={(e) => handleAudioTrack(parseInt(e.target.value))}
				>
					{audioTracks.map(([id, label]) => (
						<option key={id} value={id}>
							{label}
						</option>
					))}
				</select>
			</div>

			<div style={{ marginBottom: '10px' }}>
				<label>Subtitle Track: </label>
				<select
					value={subtitleTrack}
					onChange={(e) => handleSubtitleTrack(parseInt(e.target.value))}
				>
					{subtitleTracks.map(([id, label]) => (
						<option key={id} value={id}>
							{label}
						</option>
					))}
				</select>
			</div>

			<div style={{ marginBottom: '10px' }}>
				<label>Zoom: </label>
				<input
					type='range'
					min={-3}
					max={5}
					step={0.1}
					value={zoom}
					onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
				/>
				<span> {zoom.toFixed(1)}x</span>
			</div>
		</div>
	)
}
