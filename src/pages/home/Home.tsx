import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useServerStore } from '../../context/server.context'
import { useAuth } from '../../context/auth.context'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { Skeleton } from '../../components/ui/skeleton'
import { Video } from '../../data/interfaces/Media'
import { authenticatedFetcher } from '../../utils/utils'
import FlexBox from '../../components/ui/FlexBox'
import ContentCard from '../../components/Card'

function Home() {
	const { serverId } = useParams()
	const { user } = useAuth()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { selectServer, selectedServer, serverUrl } = useServerStore()

	// Get Continue Watching items
	const { data: continueWatching, isLoading } = useSWR<Video[]>(
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
		<FlexBox direction='column' justify='end' height={'100%'} gap={1}>
			<span className='text-xl'>{t('continueWatching')}</span>

			{/* <LogoIntro /> */}

			<FlexBox gap={1}>
				{continueWatching && continueWatching.length > 0
					? continueWatching.map((video: Video) => (
							<ContentCard
								imgSrc={video.imgSrc}
								width={280}
								title={video.title}
								action={() =>
									goToContent(
										`/details/${video.episodeId ? 'episode' : 'movie'}/${video.episodeId ? video.episodeId : video.movieId}`
									)
								}
							/>
						))
					: !isLoading
						? skeletons
						: t('noContent')}
			</FlexBox>
		</FlexBox>
	)
}

export default Home
