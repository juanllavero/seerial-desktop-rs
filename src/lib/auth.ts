import { User } from '../data/interfaces/Users'
import { CENTRAL_SERVER } from '../utils/constants'

export function getToken(): string | null {
	return localStorage.getItem('token')
}

export async function authenticatedFetch(
	url: string,
	type: string = 'GET',
	body?: any
) {
	const token = getToken()
	if (!token) throw new Error('No token available')

	const options: RequestInit = {
		method: type,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	}

	if (body && type !== 'GET') {
		options.body = JSON.stringify(body)
	}

	return await fetch(url, options)
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
