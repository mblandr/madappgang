import { loadImageData, saveImageData } from '../../../data/localStorage'
import { cachedImagesActions } from '../../../data/store'

import Loader from '../Loader'

import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ReactComponent as NoImg } from './no-img.svg'
import style from './index.module.sass'

export default function Image({
	alt = '',
	src,
	className = '',
	onLoad,
	onError,
	onStartPreview,
	onEndPreview,
	...props
}) {
	const dispatch = useDispatch(),
		[innerSrc, setInnerSrc] = useState(''),
		[error, setError] = useState(false),
		[isPreview, setIsPreview] = useState(false),
		[isHiding, setIsHiding] = useState(false),
		cachedImages = useSelector(state => state.imagesCache.list),
		inCache = useMemo(() => cachedImages.includes(src), [src, cachedImages]),
		[isLoading, setIsLoading] = useState(!inCache),
		showFullImage = e => {
			e.stopPropagation()
			setIsHiding(false)
			setIsPreview(true)
			onStartPreview && onStartPreview()
		},
		hideFullImage = e => {
			e.stopPropagation()
			setIsHiding(true)
			setTimeout(() => {
				setIsHiding(false)
				setIsPreview(false)
				onEndPreview && onEndPreview()
			}, 850)
		}
	useEffect(() => {
		if (inCache) onLoad && onLoad()
		else {
			setIsLoading(true)
			setError(false)
			setInnerSrc(loadImageData(src))

			const img = document.createElement('img')
			img.addEventListener('error', () => {
				setError(true)
				setIsLoading(false)
				onError && onError()
			})
			img.addEventListener('load', () => {
				setError(false)
				setIsLoading(false)
				setInnerSrc(src)
				dispatch(cachedImagesActions.add(src))
				saveImageData(img.src)
				onLoad && onLoad()
			})
			img.src = src
		}
	}, [inCache, src])

	if (error) return <NoImg className={`${style.img} ${className}`.trim()} />
	return (
		<>
			{isLoading && (
				<Loader className={`${style.wrapper} ${className}`.trim()} />
			)}
			{isPreview && (
				<div
					className={`${style.full} ${isHiding ? style.hide : ''}`.trim()}
					onClick={hideFullImage}
				>
					<img src={inCache ? src : innerSrc} alt={alt} />
				</div>
			)}
			{inCache ? (
				<img
					{...props}
					className={`${style.img} ${className}`.trim()}
					src={src}
					alt={alt}
					onClick={showFullImage}
				/>
			) : innerSrc ? (
				<img
					{...props}
					className={`${style.img} ${className}`.trim()}
					src={innerSrc}
					alt={alt}
					onClick={showFullImage}
				/>
			) : (
				<NoImg className={`${style.img} ${className}`.trim()} />
			)}
		</>
	)
}
