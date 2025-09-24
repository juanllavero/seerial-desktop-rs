import NavigationContainer from '@/components/navigation/NavigationContainer'
import { Library } from '@/data/interfaces/Media'
import { LibraryType } from '@/utils/constants'
import { motion, AnimatePresence } from 'framer-motion'
import FocusableButton from '@/components/navigation/NavigationButton'

interface LibrariesListProps {
	type: LibraryType
	libraries: Library[]
	show: boolean
}

function LibrariesList({ type, libraries, show }: LibrariesListProps) {
	if (!libraries) return null

	return (
		<NavigationContainer className='fixed flex justify-center items-center top-20 w-screen'>
			<AnimatePresence>
				{show && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.15, ease: 'easeInOut' }}
						className='flex justify-start overflow-x-auto bg-black/70 p-3 rounded-xl gap-2'
					>
						{libraries
							.filter((library) => library.type === type)
							.map((library) => (
								<FocusableButton
									key={library.id}
									customKey={library.id}
								>
									{library.name}
								</FocusableButton>
							))}
					</motion.div>
				)}
			</AnimatePresence>
		</NavigationContainer>
	)
}

export default LibrariesList
