import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../../components/ui/card'
import FlexBox from '../../components/ui/FlexBox'
import { useAuth } from '../../context/auth.context'
import { getToken } from '../../lib/auth'
import Login from './components/Login'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'

function Auth() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [loading, setLoading] = useState<boolean>(true)
	const [token, setToken] = useState<string | undefined>(undefined)

	useEffect(() => {
		const loadToken = async () => {
			setToken(await getToken())
			setLoading(false)
		}

		loadToken()
	}, [])

	if (loading) return <Loading />

	if (token || user) navigate('/')

	return (
		<FlexBox width={'100%'} height={'100dvh'} justify='center' align='center'>
			<Card className='bg-secondary'>
				<CardHeader className='gap-3 text-center'>
					<h1 className='text-2xl font-semibold'>Seerial Web</h1>
					<span>Inicia sesión con google</span>
				</CardHeader>
				<CardContent>
					<Login />
				</CardContent>
			</Card>
		</FlexBox>
	)
}

export default Auth
