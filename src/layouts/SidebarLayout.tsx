import { AppSidebar } from '../components/SideBar/AppSidebar'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '../components/ui/sidebar'
import { Outlet } from 'react-router-dom'

const SideBarLayout = () => {
	return (
		<div className='relative'>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<div className='h-screen'>
						<Outlet />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}

export default SideBarLayout
