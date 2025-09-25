import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useServerStore } from '../../context/server.context'
import { useAuth } from '../../context/auth.context'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { Skeleton } from '../../components/ui/skeleton'
import { authenticatedFetcher } from '../../utils/utils'
import ContentCard from '../../components/Card'
import NavigationScrollView from '@/components/navigation/NavigationScrollView'
import Page from '@/components/Page'
import HomeInfo from './components/HomeInfo'
import { ContinueWatchingElement } from '@/data/interfaces/Lists'
import { setFocus } from '@noriginmedia/norigin-spatial-navigation'

function Home() {
	const { serverId } = useParams()
	const { user } = useAuth()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { selectServer, selectedServer, serverUrl } = useServerStore()
	const [selectedElement, setSelectedElement] =
		useState<ContinueWatchingElement | null>(null)

	// Get Continue Watching items
	const { data: continueWatching, isLoading } = useSWR<
		ContinueWatchingElement[]
	>(
		selectedServer
			? `${serverUrl}/continueWatching?userId=${user?.id ?? null}`
			: null,
		authenticatedFetcher
	)

	useEffect(() => {
		if (user && serverId) {
			selectServer(
				user.servers.find((server) => server.id === serverId) ?? null
			)
		}
	}, [serverId])

	useEffect(() => {
		if (continueWatching && continueWatching.length > 0)
			setFocus(`continueWatchingCard-${continueWatching[0].id}`)
	}, [continueWatching])

	const goToContent = (url: string) => {
		navigate(url)
	}

	const skeletons = Array.from({ length: 10 }, (_, index) => (
		<Skeleton
			key={'ContinueWatching ' + index}
			className={'w-[280px] h-[400px]'}
		/>
	))

	return (
		<Page justify='end'>
			<HomeInfo selectedElement={selectedElement} />

			<span className='text-xl'>{t('continueWatching')}</span>

			{/* <LogoIntro /> */}

			<NavigationScrollView
				direction='horizontal'
				className='gap-10 w-full'
				customFocusKey='continueWatching'
			>
				{continueWatching && continueWatching.length > 0
					? continueWatching.map((element: ContinueWatchingElement) => (
							<ContentCard
								imgSrc={element.posterImage ?? ''}
								customKey={`continueWatchingCard-${element.id}`}
								height={'35dvh'}
								title={element.title}
								onFocus={() => setSelectedElement(element)}
								action={() => {
									if (element.id === selectedElement?.id) {
										goToContent(
											`/details/${element.episodeId ? 'episode' : 'movie'}/${element.episodeId ? element.episodeId : element.movieId}`
										)
									} else {
										setSelectedElement(element)
									}
								}}
							/>
						))
					: !isLoading
						? skeletons
						: t('noContent')}
			</NavigationScrollView>
		</Page>
	)
}

export default Home
