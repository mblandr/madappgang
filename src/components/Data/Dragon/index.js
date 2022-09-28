

import { userActions, dragonActions } from '../../../data/store'
import { saveDragon, loadDragon } from '../../../data/localStorage'
import Favorite from '../../UI/Favorite'
import ImageCarousel from '../../UI/ImageCarousel'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import style from './index.module.sass'
import toast from 'react-hot-toast'

export default function Dragon() {
	const { id } = useParams(),
		dispatch = useDispatch(),
		dragons = useSelector(state => state.dragons.list),
		user = useSelector(state => state.user.user),
		favorites = user && user.favorites || [],
		{ name, imgUrls, description, wikiUrl, mass, height, year } = dragons.find(
			({ id: itemId }) => id === itemId
		),
		imagesData = imgUrls.map(
			imgUrl => ({
				src: imgUrl
			})
		),
		handleChangeIsFavorite = (id, isFavorite) => {
			if (isFavorite) {

				dispatch(userActions.removeFavorite(id))
			}
			else {

				dispatch(userActions.addFavorite(id))
			}

		},
		save = async () => {
			try {
				saveDragon({ id, name, imgUrls, description, wikiUrl, mass, height, year })
			}
			catch (e) {
				toast.error(e.message)
			}
		},
		load = async () => {
			try {
				const data = await loadDragon(id)
				console.log('loaded data', data)
				dispatch(dragonActions.update({
					id, data
				}))

			}
			catch (e) {
				toast.error(e.message)
			}

		}

	return (
		<article className={style.article}>
			<Favorite className={style.favorite} isFavorite={favorites.includes(id)} onChangeIsFavorite={() => handleChangeIsFavorite(id, favorites.includes(id))} />
			<h2>{name}</h2>
			<p>{description}</p>
			<h3>Характеристики</h3>
			<button onClick={save}>Сохранить</button>
			<button onClick={load}>Загрузить</button>
			<ul>
				<li>Масса: {mass} кг</li>
				<li>Выста: {height} м</li>
				<li>Дата выпуска: {new Date(year).toLocaleDateString()}</li>
			</ul>
			<a href={wikiUrl} target='_blank'>On wikipedia</a>
			<ImageCarousel className={style.carousel} items={imagesData} />
		</article >
	)
}
