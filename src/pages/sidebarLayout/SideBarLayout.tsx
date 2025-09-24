import BaseLayout from '@/layouts/BaseLayout'
import { Outlet } from 'react-router'

function SideBarLayout() {
	return (
		<BaseLayout>
			<Outlet />
		</BaseLayout>
	)
}

export default SideBarLayout
