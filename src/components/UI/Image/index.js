import { ReactComponent as NoImg } from './no-img.svg'
import Loader from '../Loader'
import style from './index.module.sass'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { cachedImagesActions } from '../../../data/store'
import {
	clearDragons,
	loadImageData,
	saveImageData,
} from '../../../data/localStorage'

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
		[isLoading, setIsLoading] = useState(true),
		[innerSrc, setInnerSrc] = useState(''),
		[error, setError] = useState(false),
		[isPreview, setIsPreview] = useState(false),
		[isHiding, setIsHiding] = useState(false),
		cachedImages = useSelector(state => state.imagesCache.list),
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
		console.log(
			'user errct',
			'влюченв кэш=',
			cachedImages.includes(src),
			'src=',
			src.substring(0, 50),
			'cached images=',
			cachedImages
		)
		if (cachedImages.includes(src)) {
			setInnerSrc(src)
			setIsLoading(false)
			onLoad && onLoad()
			return
		}
		setInnerSrc(loadImageData(src))

		const img = document.createElement('img')
		img.addEventListener('error', () => {
			setError(true)
			setIsLoading(false)
			onError && onError()
		})
		img.addEventListener('load', () => {
			console.log('oon image loading')
			setError(false)
			setIsLoading(false)
			setInnerSrc(src)
			dispatch(cachedImagesActions.add(src))
			saveImageData(img.src)
			onLoad && onLoad()
		})
		img.src = src
	}, [src])
	console.log(
		'rendered image',
		'isloading=',
		isLoading,
		'src=',
		src,
		'innerSrc',
		innerSrc.substring(0, 50)
	)
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
					<img src={innerSrc} />
				</div>
			)}
			{innerSrc && (
				<img
					{...props}
					className={`${style.img} ${className}`.trim()}
					src={innerSrc}
					alt={alt}
					onClick={showFullImage}
				/>
			)}
		</>
	)
}
