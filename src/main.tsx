import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/routes'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './context/auth.context'
import { updateAppLanguage } from './helpers/language_helpers'

function App() {
	const { i18n } = useTranslation()

	useEffect(() => {
		updateAppLanguage(i18n)
	}, [i18n])

	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
		<AuthProvider>
			<App />
		</AuthProvider>
	</GoogleOAuthProvider>
)
