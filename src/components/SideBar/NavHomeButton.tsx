import { t } from 'i18next'
import { House } from 'lucide-react'
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '../ui/sidebar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

const NavHomeButton = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const inHome = useMemo(
		() => location.pathname.includes('/home'),
		[location.pathname]
	)

	console.log(`NavHomeButton [${new Date().toISOString()}]: `, {
		pathname: location.pathname,
		inHome,
	})

	const home = {
		id: '0',
		name: t('home'),
		logo: House,
		action: () => {
			navigate('/home')
		},
	}

	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<a
							href={''}
							className={`flex items-center gap-2 ${
								inHome ? 'bg-accent' : ''
							}`}
							onClick={(e) => {
								e.preventDefault()
								navigate('/home')
							}}
							style={{
								color: inHome ? 'var(--app-color)' : '',
							}}
						>
							<home.logo />
							<span
								className='font-semibold'
								style={{
									color: inHome ? 'var(--app-color)' : '',
								}}
							>
								{home.name}
							</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}

export default NavHomeButton
