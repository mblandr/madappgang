import {
	userActions,
	idsActions,
	dragonsCacheActions,
	refreshActions,
} from '../../../data/store'
import { getDragonsFromServer, getDragonFromServer } from '../../../data/server'
import {
	clearDragons,
	loadDragon,
	saveDragon,
} from '../../../data/localStorage'
import { setFavorites, getUser } from '../../../data/firebase'
import Image from '../../UI/Image'
import Favorite from '../../UI/Favorite'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { dragonActions } from '../../../data/store'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import style from './index.module.sass'

export default function DragonsList() {
	const idsRef = useRef(),
		offsetRef = useRef(),
		dispatch = useDispatch(),
		dragonsCache = useSelector(state => state.dragonsCache.list),
		user = useSelector(state => state.user.user),
		ids = useSelector(state => state.ids.list),
		refresh = useSelector(state => state.refresh.refresh),
		[offset, setOffset] = useState(0),
		[dragons, setDragons] = useState([]),
		[isLoading, setIsLoading] = useState(false),
		favorites = (user && user.favorites) || [],
		handleChangeIsFavorite = (id, name, isFavorite) => {
			if (isFavorite) {
				dispatch(userActions.removeFavorite(id))
			} else {
				dispatch(userActions.addFavorite({ id, name }))
			}
		},
		scrollHandler = () => {
			const totalHeight = document.documentElement.scrollHeight,
				scrolled = document.documentElement.scrollTop,
				windowHeight = window.innerHeight,
				o = offsetRef.current,
				i = idsRef.current.length
			if (scrolled + windowHeight >= totalHeight - 50 && o > 0 && o < i)
				setIsLoading(true)
		},
		resizeHandler = () => {
			const windowHeight = window.innerHeight,
				scrollHeight = document.documentElement.scrollHeight,
				o = offsetRef.current,
				i = idsRef.current.length
			if (windowHeight === scrollHeight && o > 0 && o < i) setIsLoading(true)
		},
		renderedDragons = useMemo(
			() =>
				dragons.map(({ id, name, imgUrls, description, wikiUrl }) => {
					console.log('rendered dragons', imgUrls)
					const isFavorite = favorites.some(({ id: curId }) => curId === id)
					return (
						<article key={id} className={style.article}>
							{user && (
								<Favorite
									className={style.favorite}
									isFavorite={isFavorite}
									onChangeIsFavorite={() =>
										handleChangeIsFavorite(id, name, isFavorite)
									}
								/>
							)}
							<h2>{name}</h2>
							<p>{description}</p>
							<a href={wikiUrl} target='_blank' rel='noreferrer'>
								On wikipedia
							</a>
							<Link to={`/${id}`} className={style.more}>
								More info
							</Link>
							<div className={style.images}>
								{imgUrls.map(
									(imgUrl, index) =>
										index === 0 && (
											<div key={imgUrl} className={style['img-wrapper']}>
												<div className={style['img-inner']}>
													<Image src={imgUrl} className={style.img} />
												</div>
											</div>
										)
								)}
							</div>
						</article>
					)
				}),
			[dragons]
		)
	useEffect(() => {
		if (user) setFavorites(favorites)
	}, [dragons])
	useEffect(() => {
		if (user) setFavorites(favorites)
	}, [user])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler)
		window.addEventListener('resize', resizeHandler)
		return () => {
			document.removeEventListener('scroll', scrollHandler)
			window.removeEventListener('resize', resizeHandler)
		}
	}, [])

	useEffect(() => {
		getDragonsFromServer()
			.then(result => {
				idsRef.current = result
				setOffset(0)
				setDragons([])
				dispatch(idsActions.set(result))
				setIsLoading(true)
				dispatch(refreshActions.set(false))
			})
			.catch(e => toast.error(e.message))
	}, [refresh])
	useEffect(() => {
		if (isLoading && offset < ids.length) {
			const newId = ids[offset]

			//найдем дракона в кэше драконов
			let dragon = dragonsCache.find(({ id }) => id === newId)

			if (dragon) {
				//если он в кэше, то просто добавим в  список драконов
				setDragons(dragons => [...dragons, dragon])
				setIsLoading(false)
				//обновим смещение
				setOffset(offset => offset + 1)
			} else {
				//если он не в кэше, поищем в localStorage
				dragon = loadDragon(newId)

				if (dragon) {
					//если он в localStorage, то добавим в список, но не в кэш - в LocalStorage картинки сериализованные
					setDragons(dragons => [...dragons, dragon])

					//и в фоне обновим с сервера
					getDragonFromServer(newId)
						.then(dragon => {
							//в localStorage
							saveDragon(dragon)

							//в кэше
							dispatch(dragonsCacheActions.add(dragon))

							//теперь в списке драконов - он там последний
							const tempDragon = Object.assign({}, dragon)
							setDragons(dragons => (dragons.push(), [...dragons, dragon]))
							//обновим смещение
							setOffset(old => old + 1)
						})
						.catch(e =>
							toast.error(
								`Ошибка обновления информации с сервера: ${e.message}`
							)
						)
						.finally(() => {
							setIsLoading(false)
						})
				} else {
					//если дракона нет в localStorage, то получаем с сервере
					getDragonFromServer(newId)
						.then(dragon => {
							//и добавляем его
							//в localStorage
							saveDragon(dragon)

							//в кэш
							dispatch(dragonsCacheActions.add(dragon))

							//теперь в список драконов
							setDragons(dragons => [...dragons, dragon])

							//обновим смещение
							setOffset(old => old + 1)
						})
						.catch(e =>
							toast.error(
								`Ошибка обновления информации с сервера: ${e.message}`
							)
						)
						.finally(() => {
							setIsLoading(false)
						})
				}
			}
		} else resizeHandler()
	}, [isLoading])

	idsRef.current = ids
	offsetRef.current = offset
	return (
		<>
			<h1 className={style.title}>Список Dragons</h1>
			{renderedDragons}
		</>
	)
}
