import React, { memo } from 'react'
import Card from '../../../../components/Card'
import { DropdownContent } from '../../../../data/interfaces/Utils'

interface CardProps {
	type: string
	itemKey: string
	imgSrc: string
	title: string
	subtitle: string
	watched?: boolean
	loading?: boolean
	action: () => void
	cornerNumber?: number
	hidePlayButton?: boolean
	menuContent?: DropdownContent
	editModal?: React.ReactNode
	errorSrc?: string
}

function ParentCard({ type, title, imgSrc, subtitle, action }: CardProps) {
	// console.log('Loaded ParentCard: ', itemKey)

	return (
		<Card
			imgSrc={imgSrc}
			aspectRatio={type === 'Music' ? '1' : '2/3'}
			title={title}
			subtitle={subtitle}
			action={action}
		/>
	)
}

export default memo(ParentCard)
