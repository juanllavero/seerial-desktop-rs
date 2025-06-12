import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useServerStore } from '../../context/server.context'
import { useAuth } from '../../context/auth.context'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { Card } from '../../components/ui/card'
import { Skeleton } from '../../components/ui/skeleton'
import { Video } from '../../data/interfaces/Media'
import { fetcher } from '../../utils/utils'
import FlexBox from '../../components/ui/FlexBox'
import ContentCard from '../../components/Card'

function Home() {
	const { serverIp } = useParams()
	const { user } = useAuth()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { selectServer, selectedServer } = useServerStore()

	// Get Continue Watching items
	const { data: continueWatching, isLoading } = useSWR<Video[]>(
		selectedServer ? `https://${selectedServer.ip}/continueWatching` : null,
		fetcher
	)

	useEffect(() => {
		if (user && serverIp) {
			selectServer(
				user.servers.find((server) => server.ip === serverIp) ?? null
			)
		}
	}, [serverIp])

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
