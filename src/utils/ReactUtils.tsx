import { Collection } from '../data/interfaces/Media'
import Image from '@/components/ui/Image'
import { toast } from 'sonner'

export const showToast = (
	type:
		| 'success'
		| 'error'
		| 'warning'
		| 'info'
		| 'message'
		| 'default' = 'default',
	message: string,
	title?: string
) => {
	switch (type) {
		case 'message':
			toast.message(title, {
				description: message,
			})
			break
		case 'success':
			toast.success(message)
			break
		case 'error':
			toast.error(message)
			break
		case 'warning':
			toast.warning(message)
			break
		case 'info':
			toast.info(message)
			break
		case 'default':
			toast(message)
			break
	}
}

/**
 * This method is used to show a toast notification for a promise.
 * @param promise The promise to be resolved
 * @param loadingMessage The message to be displayed while the promise is loading
 * @param successMessage The message to be displayed when the promise is resolved
 * @param errorMessage The message to be displayed when the promise is rejected
 */
export const showPromiseToast = (
	promise: Promise<any>,
	loadingMessage: string,
	successMessage: string,
	errorMessage: string
) => {
	toast.promise(promise, {
		loading: loadingMessage,
		success: () => {
			return successMessage
		},
		error: errorMessage,
	})
}

export const getFirstImage = (collection: Collection, type: string) => {
	if (type === 'Movies' && collection.movies && collection.movies.length > 0) {
		return collection.movies[0].coverSrc
	} else if (
		type === 'Series' &&
		collection.shows &&
		collection.shows.length > 0
	) {
		return collection.shows[0].coverSrc
	} else if (
		type === 'Music' &&
		collection.albums &&
		collection.albums.length > 0
	) {
		return collection.albums[0].coverSrc
	}
	return ''
}

export const getPosterImage = (collection: Collection, type: string) => {
	let images: string[] = []

	// Collect up to 4 images based on collection type
	if (type === 'Movies' && collection.movies && collection.movies.length > 0) {
		images = collection.movies.slice(0, 4).map((movie) => movie.coverSrc)
	} else if (
		type === 'Series' &&
		collection.shows &&
		collection.shows.length > 0
	) {
		images = collection.shows.slice(0, 4).map((show) => show.coverSrc)
	} else if (
		type === 'Music' &&
		collection.albums &&
		collection.albums.length > 0
	) {
		images = collection.albums.slice(0, 4).map((album) => album.coverSrc)
	}

	// If no images, return null or a placeholder
	if (images.length === 0) {
		return (
			<div className='flex h-full w-full items-center justify-center bg-gray-200'>
				<span className='text-gray-500'>No images available</span>
			</div>
		)
	}

	// Fill with placeholder images if 1 < images < 4
	if (images.length > 1 && images.length < 4) {
		const placeholdersNeeded = 4 - images.length
		for (let i = 0; i < placeholdersNeeded; i++) {
			images.push(
				`local/img/${type === 'Music' ? 'songDefault.png' : 'fileNotFound.jpg'}`
			)
		}
	}

	// Determine grid layout based on number of images
	const gridClass = 'grid-cols-2'

	if (images.length === 1) {
		return undefined
	}

	return (
		<div className={`grid ${gridClass} h-full w-full gap-1`}>
			{images.map((src, index) => {
				return (
					<Image
						key={index}
						url={src}
						alt={`Collection item ${index + 1}`}
						className='h-full w-full object-cover'
						fallbackSrc={
							type === 'Music'
								? '/img/songDefault.png'
								: '/img/fileNotFound.jpg'
						}
						aspectRatio={type === 'Music' ? 1 : 2 / 3}
					/>
				)
			})}
		</div>
	)
}
