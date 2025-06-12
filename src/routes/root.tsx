import { Navigate, Outlet } from 'react-router-dom'
import { memo, useEffect, useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { getToken, getUser } from '../lib/auth'
import Loading from '../components/Loading'
import NoServer from '../pages/noserver/NoServer'
import { Server } from '../data/interfaces/Users'

function Root() {
	const token = getToken()
	const [loading, setLoading] = useState(true)
	const [serverData, setServerData] = useState<Server | null>(null)

	if (!token && window.location.pathname !== '/auth') {
		console.log(`Root:check [${new Date().toISOString()}]: `, {
			pathname: window.location.pathname,
		})
		return <Navigate to='/auth' replace />
	}

	useEffect(() => {
		const loadServer = async () => {
			try {
				const user = await getUser()
				const server =
					user && user.servers && user.servers.length > 0
						? user.servers[0]
						: null

				setServerData(server)
				setLoading(false)
			} catch (error) {
				console.error('Error loading server:', error)
				setLoading(false)
			}
		}

		if (token) {
			loadServer()
		}
	}, [token])

	console.log({ token, serverData })

	if (loading) {
		return (
			<BaseLayout>
				<Loading />
			</BaseLayout>
		)
	}

	// Si no hay servidor, mostrar NoServer
	if (!serverData) {
		return (
			<BaseLayout>
				<NoServer />
			</BaseLayout>
		)
	}

	// Si hay servidor pero estamos en la raíz, redirigir al servidor
	if (window.location.pathname === '/') {
		return <Navigate to={`/server/${serverData.id}/home`} replace />
	}

	return (
		<BaseLayout>
			<Outlet />
		</BaseLayout>
	)
}

export default memo(Root)
