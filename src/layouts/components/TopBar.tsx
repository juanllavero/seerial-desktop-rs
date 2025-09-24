import LibrariesList from './LibrariesList'
import { Settings, User } from 'lucide-react'
import { useAuth } from '@/context/auth.context'
import { LibraryType } from '@/utils/constants'
import { useState } from 'react'
import { useServerStore } from '@/context/server.context'
import { Library } from '@/data/interfaces/Media'
import { authenticatedFetcher } from '@/utils/utils'
import useSWR from 'swr'
import FocusableButton from '@/components/navigation/NavigationButton'
import NavigationContainer from '@/components/navigation/NavigationContainer'

function TopBar() {
	const { logout } = useAuth()
	const [showLibraries, setShowLibraries] = useState(false)
	const [libraryType, setLibraryType] = useState<LibraryType>(
		LibraryType.MOVIES
	)

	const serverUrl = useServerStore((state) => state.serverUrl)

	const { data: libraries } = useSWR<Library[]>(
		serverUrl !== '' ? `${serverUrl}/libraries` : null,
		authenticatedFetcher
	)

	const showMovies =
		libraries &&
		libraries.filter((library) => library.type === LibraryType.MOVIES)
			.length > 0
	const showSeries =
		libraries &&
		libraries.filter((library) => library.type === LibraryType.SHOWS).length >
			0
	const showMusic =
		libraries &&
		libraries.filter((library) => library.type === LibraryType.MUSIC).length >
			0

	return (
		<NavigationContainer
			customFocusKey='testKey'
			className='relative flex justify-between items-center w-screen px-5 py-8'
		>
			<div>
				<FocusableButton
					customKey='user'
					title={'User'}
					icon={<User onClick={logout} />}
				/>
			</div>
			<div className='flex gap-2'>
				<FocusableButton customKey='home'>Home</FocusableButton>
				<FocusableButton
					customKey='movies'
					disabled={!showMovies}
					onClick={() => {
						if (libraryType === LibraryType.MOVIES || !showLibraries) {
							setShowLibraries(!showLibraries)
						}
						setLibraryType(LibraryType.MOVIES)
					}}
				>
					Movies
				</FocusableButton>
				<FocusableButton
					customKey='shows'
					disabled={!showSeries}
					onClick={() => {
						if (libraryType === LibraryType.SHOWS || !showLibraries) {
							setShowLibraries(!showLibraries)
						}
						setLibraryType(LibraryType.SHOWS)
					}}
				>
					Shows
				</FocusableButton>
				<FocusableButton
					customKey='music'
					disabled={!showMusic}
					onClick={() => {
						if (libraryType === LibraryType.MUSIC || !showLibraries) {
							setShowLibraries(!showLibraries)
						}
						setLibraryType(LibraryType.MUSIC)
					}}
				>
					Music
				</FocusableButton>
				<FocusableButton customKey='myList'>My List</FocusableButton>
			</div>
			<div>
				<FocusableButton customKey='settings'>
					<Settings />
				</FocusableButton>
			</div>

			<LibrariesList
				type={libraryType}
				libraries={libraries || []}
				show={showLibraries}
			/>
		</NavigationContainer>
	)
}

export default TopBar
