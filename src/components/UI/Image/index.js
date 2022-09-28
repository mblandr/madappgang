import { ReactComponent as NoImg } from './no-img.svg'
import style from './index.module.sass'


import { useState, useEffect } from 'react'

export default function Image({ alt = '', src, className = '', onLoad, onError, onStartPreview, onEndPreview, ...props }) {
	useEffect(
		() => {
			const img = document.createElement('img')

			img.addEventListener('error', () => {
				setError(true)
				setIsPreview(false)
				setIsLoading(false)
				onError && onError()
			})
			img.addEventListener('load', () => {
				setIsLoading(false)
				setIsPreview(false)
				setError(false)
				onLoad && onLoad()
			})
			img.src = src
		},
		[src])
	const [isLoading, setIsLoading] = useState(true),
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

	if (error)
		return <NoImg />

	if (isLoading)
		return <div className={`${style.wrapper} ${className}`}>
			<div className={style.ring}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	
	return <>
		{
			isPreview
			&&
			<div
				className={`${style.full} ${isHiding ? style.hide : ''}`.trim()}
				onClick={hideFullImage}
			>
				<img src={src} />
			</div>
		}

		<img
			{...props}
			className={`${style.img} ${className}`.trim()}
			src={src}
			alt={alt}
			onClick={showFullImage}
		/>

	</>
}
