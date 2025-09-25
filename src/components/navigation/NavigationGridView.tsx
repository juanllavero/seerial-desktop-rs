import {
	useFocusable,
	FocusContext,
} from '@noriginmedia/norigin-spatial-navigation'
import { memo } from 'react'

interface NavigationScrollViewProps {
	children: React.ReactNode
	className?: string
	customFocusKey?: string
}

const NavigationGridView = ({
	children,
	className,
	customFocusKey,
}: NavigationScrollViewProps) => {
	const { ref, focusKey } = useFocusable({
		trackChildren: true,
		focusKey: customFocusKey,
		saveLastFocusedChild: true,
	})

	return (
		<FocusContext.Provider value={focusKey}>
			<div
				ref={ref}
				className={`
          flex  flex-row flex-wrap overflow-y-auto pb-50 pt-10 px-3 scroll-smooth
          ${className || ''}
        `}
			>
				{children}
			</div>
		</FocusContext.Provider>
	)
}

export default memo(NavigationGridView)
