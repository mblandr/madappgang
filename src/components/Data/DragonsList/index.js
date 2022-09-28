import { userActions } from '../../../data/store'
import { setFavorites } from '../../../data/firebase'
import Image from '../../UI/Image'
import Favorite from '../../UI/Favorite'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import style from './index.module.sass'

export default function DragonsList() {

	const
		dispatch = useDispatch(),
		dragons = useSelector(state => state.dragons.list),
		user = useSelector(state => state.user.user),
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
		scrollHandler = e => {
			const totalHeight = e.target.documentElement.scrollHeight,
				scrolled = e.target.documentElement.scrollTop,
				windowHeight = window.innerHeight
			if (scrolled + windowHeight >= totalHeight - 50)
				console.log('scroll event')
		}

	useEffect(
		() => {
			if (user)
				setFavorites(favorites)
		},
		[user])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler)
		return () => document.removeEventListener('scroll', scrollHandler)
	}, [])

	return (<>
		<h1 className={style.title}>Список Dragons</h1>
		{renderedDragons}
	</>
	)
}
