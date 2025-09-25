import { CENTRAL_SERVER } from '@/utils/constants'
import { useState, useRef, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth.context'

export default function Auth() {
	const { user } = useAuth()
	const [userCode, setUserCode] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const navigate = useNavigate()
	const { login } = useAuth()

	const deviceCodeRef = useRef<string | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		const initiateDeviceAuth = async () => {
			try {
				const res = await fetch(
					`https://${CENTRAL_SERVER}/device/initiate`,
					{
						method: 'POST',
					}
				)
				const data = await res.json()

				if (!res.ok)
					throw new Error(data.error || 'Failed to start login process')

				setUserCode(data.user_code)
				deviceCodeRef.current = data.device_code

				// Generar código QR
				const qrData = `https://app.seerial.es/link?code=${data.user_code}`
				try {
					const qrUrl = await QRCode.toDataURL(qrData, {
						width: 200,
						margin: 0,
						color: {
							dark: '#000000',
							light: '#FFFFFF',
						},
					})
					setQrCodeUrl(qrUrl)
				} catch (qrError) {
					console.error('Error generating QR code:', qrError)
				}

				intervalRef.current = setInterval(() => {
					pollForToken(data.device_code)
				}, 5000) // Poll cada 5 segundos
			} catch (err: any) {
				setError(err.message)
			}
		}

		initiateDeviceAuth()

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [])

	const pollForToken = useCallback(async (deviceCode: string) => {
		try {
			const res = await fetch(`https://${CENTRAL_SERVER}/device/token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ device_code: deviceCode }),
			})

			if (res.status === 202) {
				console.log('Authorization pending...')
				return
			}

			const data = await res.json()

			if (res.ok && data.token) {
				if (intervalRef.current) clearInterval(intervalRef.current)
				console.log('Login successful!')

				login(data.token)

				setIsAuthenticated(true)

				navigate('/home')
			} else {
				throw new Error(data.error || 'An error occurred')
			}
		} catch (err: any) {
			setError(err.message)
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [])

	if (user) {
		navigate('/home')
	}

	if (isAuthenticated) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-green-950 flex flex-col items-center justify-center px-6 py-8'>
				<div className='text-center'>
					<h1 className='text-white text-5xl md:text-6xl font-light mb-4'>
						Authentication Successful!
					</h1>
					<p className='text-green-200 text-xl'>
						Welcome to Seerial. Redirecting...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-red-800 via-red-900 to-red-950 flex flex-col items-center justify-center px-6 py-8'>
				<div className='text-center'>
					<h1 className='text-white text-4xl font-light mb-4'>
						Authentication Error
					</h1>
					<p className='text-red-200 text-xl mb-8'>{error}</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-red-700 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-sm transition-colors duration-200'
					>
						Try Again
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-black flex flex-col items-center justify-center px-6 py-8'>
			{/* Título principal */}
			<div className='text-center mb-16'>
				<h1 className='text-white text-5xl md:text-6xl font-light mb-2'>
					Sign in to your Seerial account
				</h1>
			</div>

			{/* Contenido principal con dos columnas */}
			<div className='flex flex-row items-center justify-center gap-16 lg:gap-24 max-w-6xl w-full'>
				{/* Columna izquierda - Código manual */}
				<div className='text-center flex-1'>
					<p className='text-white text-xl mb-4'>
						1. Visit this link in a browser
					</p>
					<div className='text-app-color text-3xl font-bold mb-8'>
						app.seerial.es/link
					</div>

					<p className='text-white text-xl mb-6'>2. Enter this code</p>

					{/* Código de 4 caracteres */}
					<div className='flex justify-center gap-2 mb-8'>
						{userCode?.split('').map((char, index) => (
							<div
								key={index}
								className='w-16 h-20 bg-transparent border-none text-app-color text-6xl font-semibold flex items-center justify-center'
							>
								{char}
							</div>
						))}
					</div>
				</div>

				{/* Divisor OR */}
				<div className='flex flex-col items-center mx-8'>
					<div className='w-px h-32 bg-gray-400 mb-4'></div>
					<div className='text-white text-2xl font-light'>OR</div>
					<div className='w-px h-32 bg-gray-400 mt-4'></div>
				</div>

				{/* Columna derecha - QR Code */}
				<div className='text-center flex-1'>
					<p className='text-white text-xl mb-4'>
						Use the camera on your mobile
					</p>
					<p className='text-white text-xl mb-8'>
						device to scan the QR code
					</p>

					{/* Código QR */}
					<div className='flex justify-center'>
						{qrCodeUrl ? (
							<div className='bg-white p-4 rounded-lg shadow-lg'>
								<img
									src={qrCodeUrl}
									alt='QR Code for TV Login'
									className='w-48 h-48'
								/>
							</div>
						) : (
							<div className='w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center'>
								<div className='text-gray-400 text-center'>
									<div className='animate-spin text-4xl mb-2'>⏳</div>
									<p>Generating QR...</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer con términos */}
			<div className='mt-16 max-w-4xl text-center'>
				<p className='text-gray-300 text-sm leading-relaxed'>
					By creating an account or continuing to use a Seerial
					application, website, or software, you acknowledge and agree that
					you have accepted the Terms of Service and have reviewed the
					Privacy Policy. See settings for more information.
				</p>
			</div>
		</div>
	)
}
