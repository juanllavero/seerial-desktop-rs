import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ParentCard from './ParentCard'
import useDataStore from '../../../../context/data.context'
import { useServerStore } from '../../../../context/server.context'
import { Album } from '../../../../data/interfaces/Music'
import { DropdownContent } from '../../../../data/interfaces/Utils'

interface AlbumCardProps {
	album: Album
}

function AlbumCard({ album }: AlbumCardProps) {
	const { t } = useTranslation()
	const { selectAlbum } = useDataStore()
	const { selectedServer } = useServerStore()
	const navigate = useNavigate()

	const menuContent: DropdownContent = {
		items: [
			{
				separator: false,
				items: [
					{
						title: t('updateMetadata'),
						action: () => console.log('Profile clicked'),
					},
					//   {
					//     title: t('correctIdentification'),
					//     action: () => openIdentificationDialog(series, undefined),
					//     hidden: library.type !== 'Shows',
					//   },
					//   {
					//     title: t('changeEpisodesGroup'),
					//     action: () => openEpisodesGroupDialog(series),
					//     hidden: library.type !== 'Shows',
					//   },
					//   {
					//     title: series.watched ? t('markUnwatched') : t('markWatched'),
					//     action: () => console.log('Log out clicked'),
					//     hidden: library.type === 'Music',
					//   },
				],
			},
			{ separator: true, items: [] },
			{
				separator: false,
				items: [
					{
						title: t('removeButton'),
						action: () => console.log('Log out clicked'),
					},
				],
			},
		],
	}

	return (
		<ParentCard
			itemKey={album.id}
			type='Music'
			imgSrc={album.coverSrc}
			title={album.title}
			subtitle={album.year ?? '-'}
			action={() => {
				selectAlbum(album.id)
				navigate(`/server/${selectedServer?.id}/details/album/${album.id}`)
			}}
			hidePlayButton
			menuContent={menuContent}
			editModal={<></>}
			errorSrc='/img/songDefault.png'
		/>
	)
}

export default AlbumCard
