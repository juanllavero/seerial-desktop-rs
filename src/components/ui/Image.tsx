import { useServerStore } from '@/context/server.context'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from './skeleton'
import { isAbsolutePath } from '@/utils/ReactUtils'

interface ImageProps {
	url?: string
	src?: string
	fallbackSrc?: string
	alt?: string
	aspectRatio?: string
	width?: string
	height?: string
	objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
	style?: React.CSSProperties
	className?: string
	onClick?: () => void
}

const Image: React.FC<ImageProps> = ({
	url,
	src,
	fallbackSrc,
	alt,
	aspectRatio = '2/3',
	width,
	height,
	style,
	objectFit = 'cover',
	className = '',
	onClick,
}) => {
	const serverUrl = useServerStore((state) => state.serverUrl)
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)
	const [isInView, setIsInView] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const [imageSrc, setImageSrc] = useState(
		url
			? url.startsWith('http2')
				? url
				: url.startsWith('local')
					? url.replace('local', '')
					: isAbsolutePath(url)
						? `${serverUrl}/image?path=${encodeURIComponent(url)}`
						: `${serverUrl}/${url.replace('resources/img', 'img')}`
			: (src ?? fallbackSrc)
	)

	// Update imageSrc when url, src, or serverUrl changes
	useEffect(() => {
		setIsLoading(true)
		setHasError(false)
		const newSrc = url
			? url.startsWith('http2')
				? url
				: url.startsWith('local')
					? url.replace('local', '')
					: isAbsolutePath(url)
						? `${serverUrl}/image?path=${encodeURIComponent(url)}`
						: `${serverUrl}/${url.replace('resources/img', 'img')}`
			: (src ?? fallbackSrc)
		setImageSrc(newSrc)
	}, [url, src, serverUrl, fallbackSrc])

	// Intersection Observer for lazy loading
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsInView(true)
						observer.disconnect()
					}
				})
			},
			{ threshold: 0.1 }
		)

		if (containerRef.current) {
			observer.observe(containerRef.current)
		}

		return () => observer.disconnect()
	}, [])

	const handleImageLoad = () => {
		setIsLoading(false)
	}

	const handleImageError = () => {
		if (!hasError) {
			setHasError(true)
			if (imgRef.current) {
				imgRef.current.src = fallbackSrc ?? ''
			}
		} else {
			setIsLoading(false)
		}
	}

	return (
		<div
			ref={containerRef}
			className={`relative overflow-hidden ${className} transition-all duration-500 ease-in-out`}
			style={{
				width,
				height,
				aspectRatio,
			}}
			onClick={onClick}
		>
			{isLoading && <Skeleton className='absolute inset-0 h-full w-full' />}

			{isInView && (
				<img
					ref={imgRef}
					src={imageSrc}
					alt={alt}
					onLoad={handleImageLoad}
					onError={handleImageError}
					className={`h-full w-full object-${objectFit} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} `}
					loading='lazy'
					style={style}
				/>
			)}

			{/* Fallback when every image fails */}
			{!isLoading && hasError && (
				<div className='absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400'>
					<svg
						className='h-12 w-12'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
						/>
					</svg>
				</div>
			)}
		</div>
	)
}

export default Image
