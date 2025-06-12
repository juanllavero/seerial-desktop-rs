import { useCardWidth } from '../hooks/useCardWidth'
import FlexBox from './ui/FlexBox'
import LazyImage from './ui/LazyImage'

interface CardProps {
	imgSrc: string
	aspectRatio?: string
	width?: number
	title?: string
	subtitle?: string
	action: () => void
}

function ContentCard({
	imgSrc,
	aspectRatio = '2/3',
	width,
	title,
	subtitle,
	action,
}: CardProps) {
	const { cardWidth } = useCardWidth()
	const finalWidth = width ?? cardWidth

	return (
		<FlexBox onClick={action}>
			<LazyImage url={imgSrc} width={finalWidth} aspectRatio={aspectRatio} />
			{title && <span>{title}</span>}
			{subtitle && <span>{subtitle}</span>}
		</FlexBox>
	)
}

export default ContentCard
