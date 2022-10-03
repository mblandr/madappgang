import style from './index.module.sass'
import Image from '../Image'
import { useState, useEffect, useRef } from 'react'

export default function ImageCarousel({
	className = '',
	items = [],
	...props
}) {
	const [index, setIndex] = useState(0),
		indexRef = useRef(),
		isPreviewStartedRef = useRef(false),
		itemsRef = useRef([]),
		getNextIndex = index =>
			itemsRef.current.length === 0 ? 0 : (index + 1) % itemsRef.current.length,
		onStartPreview = () => {
			isPreviewStartedRef.current = true
		},
		onEndPreview = () => {
			isPreviewStartedRef.current = false
			moveNext()
		},
		moveNext = () =>
			setTimeout(() => {
				if (!isPreviewStartedRef.current) setIndex(getNextIndex(index))
			}, 2000)

	if (items.length === 0) return <p>No items in carousel</p>

	const { src, alt } = items[index]

	indexRef.current = index
	itemsRef.current = items
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
		</div>
	)
}
