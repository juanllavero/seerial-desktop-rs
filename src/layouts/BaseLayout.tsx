import TopBar from './components/TopBar'

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='w-full h-full m-0 bg-background flex flex-col items-center bg-stone-900'>
			<TopBar />
			{children}
		</div>
	)
}

export default BaseLayout
