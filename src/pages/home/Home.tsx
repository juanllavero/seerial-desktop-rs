import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useServerStore } from '../../context/server.context'
import { useAuth } from '../../context/auth.context'

function Home() {
	const { serverIp } = useParams()
	const { user } = useAuth()
	const { selectServer } = useServerStore()

	useEffect(() => {
		if (user && serverIp) {
			selectServer(
				user.servers.find((server) => server.ip === serverIp) ?? null
			)
		}
	}, [serverIp])
	return <div>Home</div>
}

export default Home
