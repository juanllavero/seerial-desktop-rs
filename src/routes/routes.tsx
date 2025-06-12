import { Navigate, Outlet, Route, Routes, useParams } from 'react-router'
import Root from './root'
import SidebarLayout from '../layouts/SidebarLayout'
import Auth from '../pages/auth/Auth'
import VideoPlayer from '../pages/videoplayer/VideoPlayer'
import Details from '../pages/details/Details'
import Library from '../pages/library/Library'
import Home from '../pages/home/Home'
import { useServerStore } from '../context/server.context'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { getUser } from '../lib/auth'
import { Server } from '../data/interfaces/Users'
import NoServer from '../pages/noserver/NoServer'

// Wrapper for ServerRoute to handle loader logic
function ServerRouteWrapper() {
	const { serverId } = useParams()
	const { selectedServer, selectServer } = useServerStore()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadServer() {
			console.log(
				`Server/:serverId:loader [${new Date().toISOString()}]: `,
				{
					serverId,
				}
			)
			const user = await getUser()
			const foundServer = user?.servers.find(
				(s: Server) => s.id === serverId
			)
			selectServer(foundServer ?? null)
			setLoading(false)
		}
		loadServer()
	}, [serverId])

	if (loading) {
		return <Loading />
	}

	if (!selectedServer) {
		return <Navigate to='/noserver' replace />
	}

	return <Outlet />
}

export function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<Root />}>
				<Route path='/auth' element={<Auth />} />
				<Route path='/noserver' element={<NoServer />} />
				<Route path='server/:serverId/*' element={<ServerRouteWrapper />}>
					<Route element={<SidebarLayout />}>
						<Route path='home' element={<Home />} />
						<Route path='library/:libraryId' element={<Library />} />
					</Route>
					<Route path='details/:type/:id' element={<Details />} />
					<Route path='video-player/:videoId' element={<VideoPlayer />} />
				</Route>
			</Route>
		</Routes>
	)
}
