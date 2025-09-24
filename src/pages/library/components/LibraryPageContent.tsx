import { useMemo, useEffect } from 'react'
import useSWR from 'swr'
import useDataStore from '../../../context/data.context'
import { useWebSocketStore } from '../../../context/ws.context'
import { MessageType } from '../../../data/enums/WSMessage'
import { Library } from '../../../data/interfaces/Media'
import { useCardWidth } from '../../../hooks/useCardWidth'
import { authenticatedFetcher } from '../../../utils/utils'
import LibraryPageSkeleton from './LibraryPageSkeleton'
import LibraryContent from './LibraryContent'
import NoContent from './NoContent'

interface LibraryPageContentProps {
	libraryId: string
	serverIP: string
}

function LibraryPageContent({ libraryId, serverIP }: LibraryPageContentProps) {
	const { cardWidth } = useCardWidth()
	const { wsMessage } = useWebSocketStore()
	const { selectedLibraryId, selectLibrary } = useDataStore()
	const {
		data: library,
		isLoading,
		mutate,
	} = useSWR<Library>(
		`https://${serverIP}/library?id=${libraryId}`,
		authenticatedFetcher
	)

	// Memoize library to prevent unnecessary re-renders
	const memoizedLibrary = useMemo(() => library, [library?.id])

	useEffect(() => {
		if (library && library.id !== selectedLibraryId) {
			console.log('selectLibrary triggered:', {
				libraryId: library.id,
				selectedLibraryId,
			})
			selectLibrary(library.id)
		}
	}, [library?.id, selectedLibraryId, selectLibrary])

	// Mutate content on ws message
	useEffect(() => {
		console.log('wsMessage:', wsMessage)
		if (wsMessage === MessageType.MUTATE_LIBRARY) {
			mutate()
		}
	}, [wsMessage, mutate])

	if (isLoading) {
		return <LibraryPageSkeleton cardWidth={cardWidth} />
	}

	if (!memoizedLibrary) {
		return <NoContent />
	}

	return <LibraryContent library={memoizedLibrary} />
}

export default LibraryPageContent
