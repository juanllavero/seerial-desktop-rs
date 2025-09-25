import TopBar from './components/TopBar'

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='w-full h-full m-0 bg-transparent flex flex-col items-cente'>
			<TopBar />
			{children}
		</div>
	)
}

export default BaseLayout
