import { userActions } from '../../../data/store'
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
		totalRef = useRef(),
		offsetRef = useRef(),

		dispatch = useDispatch(),
		dragons = useSelector(state => state.dragons.list),
		user = useSelector(state => state.user.user),
		[isLoading, setIsLoading] = useState(true),
		[total, setTotal] = useState(0),
		[offset, setOffset] = useState(0),
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
			if (scrolled + windowHeight >= totalHeight - 50 && offsetRef.current < totalRef.current)
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
		return () => document.removeEventListener('scroll', scrollHandler)
	}, [])

	useEffect(() => {
		axios
			.post(
				'https://api.spacexdata.com/v4/dragons/query',
				{
					"options": {
						"select": "id"
					}
				}
			)
			.then(result => setTotal(result.data.totalDocs))
			.catch(e => toast.error(e.message))
	},
		[]
	)
	useEffect(() => {
		if (isLoading) {
			console.log('request', offset)
			axios
				.post(
					'https://api.spacexdata.com/v4/dragons/query',
					{
						"options": {
							offset,
							select: "id name flickr_images description wikipedia launch_payload_mass height_w_trunk first_flight",
							limit: 1
						}
					}
				)
			.then(result => {
				const { id, name, flickr_images: imgUrls, description, wikipedia: wikiUrl, launch_payload_mass: { kg: mass }, height_w_trunk: { meters: height }, first_flight: year } = result.data.docs[0],
					dragon = { id, name, imgUrls, description, wikiUrl, mass, height, year }
				setOffset(offset + 1)
				dispatch(dragonActions.add(dragon))

			})
			.catch(e => toast.error(e.message))
			.finally(() => setIsLoading(false))
		}
	},
		[isLoading]
	)

	//useEffect(
	//	() => {

	//		axios
	//			.get('https://api.spacexdata.com/v4/dragons')
	//			.then(res => {
	//				const dragons = res.data.map(
	//					(
	//						{ id, name, flickr_images: imgUrls, description, wikipedia: wikiUrl, launch_payload_mass: { kg: mass }, height_w_trunk: { meters: height }, first_flight: year }
	//					) => (
	//						{
	//							id, name, imgUrls, description, wikiUrl, mass, height, year
	//						}
	//					)
	//				)
	//				const id = getCookie('user')
	//				if (id)
	//					getUser(id)
	//						.then(userData => dispatch(userActions.login(userData)))
	//						.catch(e => toast.error(e.message))
	//				dispatch(dragonActions.set(dragons))
	//			})
	//	}, [])
	totalRef.current = total
	offsetRef.current = offset
	return (<>
		<h1 className={style.title}>Список Dragons</h1>
		{renderedDragons}
	</>
	)
}
