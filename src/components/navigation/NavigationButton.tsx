import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { memo } from 'react'
import { Button } from '../ui/button'

interface FocusableButtonProps {
	text?: string
	title?: string
	icon?: React.ReactElement
	children?: React.ReactNode
	disabled?: boolean
	onClick?: () => void
	customKey?: string
}

function FocusableButton({
	text,
	title,
	icon,
	children,
	disabled,
	onClick,
	customKey,
}: FocusableButtonProps) {
	const { ref, focused } = useFocusable({
		onEnterPress: onClick,
		focusKey: customKey,
	})

	return (
		<Button
			ref={ref}
			title={title}
			className={focused ? 'bg-stone-500' : ''}
			disabled={disabled}
			onClick={onClick}
		>
			{icon}
			{text}
			{children}
		</Button>
	)
}

export default memo(FocusableButton)
