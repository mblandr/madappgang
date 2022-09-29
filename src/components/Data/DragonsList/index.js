import { userActions, idsActions, offsetActions } from '../../../data/store'
import { getDragons, getDragon } from '../../../data/server'
import { setFavorites, getUser } from '../../../data/firebase'
import Image from '../../UI/Image'
import Favorite from '../../UI/Favorite'



import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { dragonActions } from '../../../data/store'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import style from './index.module.sass'

export default function DragonsList() {

	const
		idsRef = useRef(),
		offsetRef = useRef(),

		dispatch = useDispatch(),
		dragons = useSelector(state => state.dragons.list),
		user = useSelector(state => state.user.user),
		ids = useSelector(state => state.ids.list),
		offset = useSelector(state => state.offset.value),
		[isLoading, setIsLoading] = useState(false),
		favorites = user && user.favorites || [],
		handleChangeIsFavorite = (id, isFavorite) => {
			if (isFavorite) {

				dispatch(userActions.removeFavorite(id))
			}
			else {

				dispatch(userActions.addFavorite(id))
			}

		},
		renderedDragons = dragons.map(
			({ id, name, imgUrls, description, wikiUrl }) =>

				<article key={id} className={style.article}>
					{
						user &&
						<Favorite className={style.favorite} isFavorite={favorites.includes(id)} onChangeIsFavorite={() => handleChangeIsFavorite(id, favorites.includes(id))} />
					}
					<h2>{name}</h2>
					<p>{description}</p>
					<a href={wikiUrl} target='_blank' rel="noreferrer">On wikipedia</a>
					<Link to={`/${id}`} className={style.more}>More info</Link>
					<div className={style.images}>

						{imgUrls.map(
							imgUrl =>
								<div key={imgUrl} className={style['img-wrapper']}>
									<div className={style['img-inner']}>
										<Image key={imgUrl} src={imgUrl} className={style.img} />
									</div>
								</div>
						)}

					</div>

				</article >
		),
		scrollHandler = () => {
			const totalHeight = document.documentElement.scrollHeight,
				scrolled = document.documentElement.scrollTop,
				windowHeight = window.innerHeight
			if (scrolled + windowHeight >= totalHeight - 50 && offsetRef.current < idsRef.current.length)
				setIsLoading(true)

		},
		resizeHandler = () => {
			const windowHeight = window.innerHeight,
				scrollHeight = document.documentElement.scrollHeight
			if (windowHeight === scrollHeight && offsetRef.current < idsRef.current.length)
				setIsLoading(true)
		}


	useEffect(
		() => {
			if (user)
				setFavorites(favorites)
		},
		[user])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler)
		window.addEventListener('resize', resizeHandler)
		return () => {
			document.removeEventListener('scroll', scrollHandler)
			window.removeEventListener('resize', resizeHandler)
		}
	}, [])

	useEffect(() => {
		getDragons()
			.then(result => {
				idsRef.current = result
				dispatch(idsActions.set(result))
				setIsLoading(true)
			})
			.catch(e => toast.error(e.message))
	},
		[]
	)
	useEffect(() => {

		if (isLoading && offset < ids.length)
			getDragon(ids[offset])
				.then(result => {
					dispatch(offsetActions.set(offset + 1))
					dispatch(dragonActions.add(result))

				})
				.catch(e => toast.error(e.message))
				.finally(() => {
					setIsLoading(false)
				})
		else resizeHandler()
	},
		[isLoading]
	)


	idsRef.current = ids
	offsetRef.current = offset
	return (<>
		<h1 className={style.title}>Список Dragons</h1>
		{renderedDragons}
	</>
	)
}
