import { useMemo } from 'react'
import { useParams } from 'react-router'
import { useServerStore } from '../../context/server.context'
import LibraryPageContent from './components/LibraryPageContent'

function Library() {
	const { libraryId } = useParams()
	const { selectedServer } = useServerStore()

	// Memoize serverIP
	const serverIP = useMemo(() => selectedServer?.ip, [selectedServer?.ip])

	console.log(`LibraryPage [${new Date().toISOString()}]: `, {
		libraryId,
		serverIP,
		serverId: selectedServer?.id,
	})

	return (
		<LibraryPageContent
			libraryId={libraryId ?? ''}
			serverIP={serverIP ?? ''}
		/>
	)
}

export default Library
