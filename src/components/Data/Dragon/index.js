

import { userActions, dragonsCacheActions } from '../../../data/store'
import Favorite from '../../UI/Favorite'
import { getDragonFromServer } from '../../../data/server'
import { loadDragon, saveDragon } from '../../../data/localStorage'
import ImageCarousel from '../../UI/ImageCarousel'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import style from './index.module.sass'
import toast from 'react-hot-toast'

export default function Dragon() {
	const { id: curId } = useParams(),
		dispatch = useDispatch(),
		dragonsCache = useSelector(state => state.dragonsCache.list),
		[dragon, setDragon] = useState(null),
		user = useSelector(state => state.user.user),
		favorites = user && user.favorites || [],
		handleChangeIsFavorite = (id, isFavorite) => {
			if (isFavorite) {

				dispatch(userActions.removeFavorite(id))
			}
			else {

				dispatch(userActions.addFavorite(id))
			}

		}
	useEffect(
		() => {
			//найдем дракона в кэше драконов
			let dragon = dragonsCache.find(
				({ id }) => id === curId
			)

			if (dragon)
				//если он в кэше, то его и используем
				setDragon(dragon)

			else {
				//если он не в кэше, поищем в localStorage
				dragon = loadDragon(curId)

				if (dragon) {

					//если он в localStorage, то возьмем из него
					//в кэш не записываем, т.к. картинки там сериализованные
					setDragon(dragon)

					//и в фоне обновим с сервера
					getDragonFromServer(curId)
						.then(
							dragon => {

								//добавим в кэш
								dispatch(dragonsCacheActions.add(dragon))

								//в localStorage	- 							
								saveDragon(dragon)

								//его и используем								
								setDragon(dragon)


							}
						)
						.catch(e => toast.error(`Ошибка обновления информации с сервера: ${e.message}`))

				}
				else {
					//если дракона нет в localStorage, то получаем с сервере					
					getDragonFromServer(curId)
						.then(
							dragon => {

								//и добавляем его
								//в localStorage								
								saveDragon(dragon)

								//добавим в кэш
								dispatch(dragonsCacheActions.add(dragon))

								//его и используем
								setDragon(dragon)


							}
						)
						.catch(e => toast.error(`Ошибка обновления информации с сервера: ${e.message}`))
				}
			}
		},
		[])
	if (dragon) {
		const { id, name, description, mass, height, year, wikiUrl, imgUrls } = dragon,
			items = imgUrls.map(
				imgUrl => ({
					src: imgUrl,
					alt: name
				})
			)
		return (
			<article className={style.article}>
				{
					user
					&&
					<Favorite className={style.favorite} isFavorite={favorites.includes(id)} onChangeIsFavorite={() => handleChangeIsFavorite(id, favorites.includes(id))} />
				}
				<h2>{name}</h2>
				<p>{description}</p>
				<h3>Характеристики</h3>
				<ul>
					<li>Масса: {mass} кг</li>
					<li>Выста: {height} м</li>
					<li>Дата выпуска: {new Date(year).toLocaleDateString()}</li>
				</ul>
				<a href={wikiUrl} target='_blank'>On wikipedia</a>
				<ImageCarousel className={style.carousel} items={items} />
			</article >
		)
	}
}
