import { ReactComponent as NoImg } from './no-img.svg'
import Loader from '../Loader'
import style from './index.module.sass'

import { useState, useEffect, useContext } from 'react'
import { CacheContext } from '../../Data/Dragon'

export default function Image({
	alt = '',
	src,
	oldSrc,
	className = '',
	onLoad,
	onError,
	onStartPreview,
	onEndPreview,
	...props
}) {
	const removeCachedImg = useContext(CacheContext)
	useEffect(() => {
		const img = document.createElement('img')

		img.addEventListener('error', () => {
			setError(true)
			setIsPreview(false)
			setIsLoading(false)
			onError && onError()
		})
		img.addEventListener('load', () => {
			setIsPreview(false)
			setError(false)
			if (img.src === src) {
				setIsLoading(false)
				setCurSrc(src)
				if (removeCachedImg) removeCachedImg(img.src)
				onLoad && onLoad()
			} else {
				img.src = src
			}
		})
		img.src = oldSrc ? oldSrc : src
	}, [src, oldSrc])
	const [isLoading, setIsLoading] = useState(true),
		[curSrc, setCurSrc] = useState(oldSrc ? oldSrc : src),
		[error, setError] = useState(false),
		[isPreview, setIsPreview] = useState(false),
		[isHiding, setIsHiding] = useState(false)
	const showFullImage = e => {
		e.stopPropagation()
		setIsHiding(false)
		setIsPreview(true)
		onStartPreview && onStartPreview()
	}

	const hideFullImage = e => {
		e.stopPropagation()
		setIsHiding(true)
		setTimeout(() => {
			setIsHiding(false)
			setIsPreview(false)
			onEndPreview && onEndPreview()
		}, 850)
	}

	if (error) return <NoImg />
	console.log('image', 'cursrc', curSrc.substring(0, 50))
	return (
		<>
			{isLoading && <Loader className={`${style.wrapper} ${className}`} />}
			{isPreview && (
				<div
					className={`${style.full} ${isHiding ? style.hide : ''}`.trim()}
					onClick={hideFullImage}
				>
					<img src={curSrc} />
				</div>
			)}

			<img
				{...props}
				className={`${style.img} ${className}`.trim()}
				src={curSrc}
				alt={alt}
				onClick={showFullImage}
			/>
		</>
	)
}
