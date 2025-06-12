import Grid from '../../../components/ui/Grid'
import { Library } from '../../../data/interfaces/Media'
import { useCardWidth } from '../../../hooks/useCardWidth'
import AlbumList from './lists/AlbumList'
import MoviesList from './lists/MoviesList'
import SeriesList from './lists/SeriesList'

interface LibraryContentProps {
	library: Library
}

function LibraryContent({ library }: LibraryContentProps) {
	const { cardWidth } = useCardWidth()

	const ItemsList = () =>
		library.type === 'Music' ? (
			<AlbumList library={library} />
		) : library.type === 'Shows' ? (
			<SeriesList library={library} />
		) : (
			<MoviesList library={library} />
		)

	console.log('LibraryContent: ', library.id)

	return (
		<Grid
			columns={`repeat(auto-fit, minmax(${cardWidth * 0.8}px, 1fr))`}
			rows='0fr'
			gap='1rem'
			height='100%'
			scroll='vertical'
			justifyContent='start'
			alignItems='start'
			hideScrollbar
		>
			<ItemsList />
		</Grid>
	)
}

export default LibraryContent
