import style from './index.module.sass'
import Image from '../Image'
import { useState, useEffect } from 'react'

export default function ImageCarousel({ className = '', items = [], ...props }) {
	useEffect(
		() => {
			const int = setInterval(() => {

			}, 3000)
			return () => clearInterval(int)
		},
		[])
	let previewStarted = false
	const [index, setIndex] = useState(0),
		moveNext = () => {
			setTimeout(() => {
				const nextIndex = items.length === 0 ? 0 : (index + 1) % items.length
				if (!previewStarted) setIndex(nextIndex)
			}, 3000)

		},
		onStartPreview = () => { previewStarted = true },
		onEndPreview = () => {
			previewStarted = false
			moveNext()

		}

	if (items.length === 0)
		return

	const { src, alt } = items[index]
	return (
		<div className={`${style.carousel} ${className}`.trim()}>
			<div className={style['carousel-inner']}>
				<Image
					{...props}
					className={style['carousel-img']}
					src={src}
					alt={alt}
					onLoad={moveNext}
					onError={moveNext}
					onStartPreview={onStartPreview}
					onEndPreview={onEndPreview}
				/>
			</div>
		</div >
	)
}
