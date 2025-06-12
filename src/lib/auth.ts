import { User } from '../data/interfaces/Users'
import { CENTRAL_SERVER } from '../utils/constants'
import { getAuthStore } from './store'

export async function getToken(): Promise<string | undefined> {
	const store = await getAuthStore()
	return await store.get<string>('token')
}

export async function getUser(): Promise<User | null> {
	const token = getToken()
	if (!token) return null

	const res = await fetch(`https://${CENTRAL_SERVER}/users/me`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) return null

	return await res.json()
}
