import { memo, useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import Auth from '../pages/auth/Auth'
import Loading from '../components/Loading'
import { useAuth } from '../context/auth.context'
import { useServerStore } from '../context/server.context'
import { getUser } from '../lib/auth'
import Home from '../pages/home/Home'
import Library from '../pages/library/Library'
import MovieDetails from '../pages/details/movie/MovieDetails'
import SeriesDetails from '../pages/details/series/SeriesDetails'
import AlbumDetails from '../pages/details/album/AlbumDetails'
import CollectionDetails from '../pages/details/collection/CollectionDetails'
import VideoPlayer from '../pages/videoplayer/VideoPlayer'
import Root from './root'
import SideBarLayout from '@/pages/sidebarLayout/SideBarLayout'

// Wrapper for ServerRoute to handle loader logic
function ServerRouteWrapper() {
	const { serverId } = useParams()
	const { logout, isLoading } = useAuth()
	const { selectedServer, selectServer } = useServerStore(
		(state) => ({
			selectedServer: state.selectedServer,
			selectServer: state.selectServer,
		}),
		shallow
	)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadServer() {
			const user = await getUser()

			if (!isLoading && !user) {
				logout()
				return <Navigate to='/auth' replace />
			}

			const foundServer = user?.servers.find((s) => s.id === serverId)
			selectServer(foundServer ?? null)
			setLoading(false)
		}
		loadServer()
	}, [serverId])

	if (loading) {
		return <Loading />
	}

	if (!selectedServer) {
		return <Navigate to='/home' replace />
	}

	return <Outlet />
}

export function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<Root />}>
				<Route path='/auth' element={<Auth />} />
				<Route index element={<Navigate to='/home' replace />} />

				<Route element={<SideBarLayout />}>
					<Route path='/home2' element={<Home />} />
					<Route path='/home' element={<VideoPlayer />} />
					<Route
						path='/server/:serverId/*'
						element={<ServerRouteWrapper />}
					>
						<Route index element={<Navigate to='library' replace />} />
						<Route
							path='library/:libraryId/:type'
							element={<Library />}
						/>
						<Route
							path='details/movie/:movieId'
							element={<MovieDetails />}
						/>
						<Route
							path='details/series/:seriesId'
							element={<SeriesDetails />}
						/>
						<Route
							path='details/album/:albumId'
							element={<AlbumDetails />}
						/>
						<Route
							path='details/collection/:collectionId/:type'
							element={<CollectionDetails />}
						/>
					</Route>
				</Route>
				<Route path='/server/:serverId/*' element={<ServerRouteWrapper />}>
					<Route path='video-player/:videoId' element={<VideoPlayer />} />
				</Route>
			</Route>
		</Routes>
	)
}

// Export memoized components for consistency
export const MemoizedHomePage = memo(Home)
export const MemoizedLoginPage = memo(Auth)
export const MemoizedLibraryPage = memo(Library)
export const MemoizedMovieDetailsPage = memo(MovieDetails)
export const MemoizedSeriesDetailsPage = memo(SeriesDetails)
export const MemoizedAlbumDetailsPage = memo(AlbumDetails)
export const MemoizedCollectionDetailsPage = memo(CollectionDetails)
export const MemoizedVideoPlayerPage = memo(VideoPlayer)
