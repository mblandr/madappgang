import { userActions } from '../../../data/store'
import { deleteCookie } from '../../../data/cookie'
import { updateInfo } from '../../../data/firebase'

import TextInput from '../../UI/TextInput'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { ReactComponent as ProfileIcon } from './profile.svg'
import { ReactComponent as FavIcon } from './fav.svg'
import { ReactComponent as RemoveIcon } from './remove.svg'
import style from './index.module.sass'

export default function Profile() {
	const [page, setPage] = useState('profile'),
		dispatch = useDispatch(),
		navigate = useNavigate(),
		user = useSelector(state => state.user.user),
		favorites = (user && user.favorites) || [],
		[formData, setFormData] = useState({
			displayName: user.displayName,
			email: user.email,
			password: '',
			newPassword: '',
		}),
		handleFormInput = e => {
			const name = e.target.name,
				value = e.target.value
			setFormData({ ...formData, [name]: value })
		},
		handleTitleClick = name => setPage(name),
		handleRemoveFavorite = id => dispatch(userActions.removeFavorite(id)),
		handleSubmit = e => {
			e.preventDefault()

			updateInfo({
				displayName: formData.displayName,
				oldDisplayName: user.displayName,
				email: formData.email,
				oldEmail: user.email,
				oldPassword: formData.password,
				password: formData.newPassword,
			})
				.then(() => {
					const oldEmail = user.email,
						oldPassword = formData.password
					dispatch(
						userActions.update({
							displayName: formData.displayName,
							email: formData.email,
						})
					)
					if (formData.email !== oldEmail) {
						toast('Подтверждающее письмо отправлено на email')
						deleteCookie('user')
						dispatch(userActions.logout())
						navigate('/')
					} else if (
						formData.newPassword !== oldPassword &&
						formData.newPassword.trim()
					) {
						toast('Пароль изменен')
						deleteCookie('user')
						dispatch(userActions.logout())
						navigate('/')
					} else toast('Данные обновлены')
				})
				.catch(e => toast.error(e.message))
		}

	return (
		<>
			<h1>{page === 'profile' ? 'Профиль пользователя' : 'Избранное'}</h1>
			<div className={style.tabs}>
				<div
					className={page === 'profile' ? style.active : null}
					onClick={() => handleTitleClick('profile')}
				>
					<ProfileIcon />
				</div>
				<div
					className={page === 'favorites' ? style.active : null}
					onClick={() => handleTitleClick('favorites')}
				>
					<FavIcon />
				</div>
			</div>
			<div className={style.content}>
				{page === 'profile' ? (
					<>
						<form onSubmit={handleSubmit}>
							<TextInput
								required
								className={style.input}
								label='Текущий пароль'
								type='password'
								name='password'
								onChange={handleFormInput}
							/>
							<TextInput
								className={style.input}
								label='Имя'
								name='displayName'
								value={formData.displayName}
								onChange={handleFormInput}
							/>
							<TextInput
								className={style.input}
								label='Email'
								type='email'
								name='email'
								value={formData.email}
								onChange={handleFormInput}
							/>
							<TextInput
								className={style.input}
								label='Новый пароль'
								type='password'
								name='newPassword'
								onChange={handleFormInput}
							/>
							<button className={style.button}>Записать</button>
						</form>
					</>
				) : (
					<>
						{favorites.length > 0 && (
							<>
								<ul className={style.fav}>
									{favorites.map(({ id, name }) => (
										<li key={id}>
											<Link to={`/${id}`}>{name}</Link>
											<RemoveIcon onClick={() => handleRemoveFavorite(id)} />
										</li>
									))}
								</ul>
							</>
						)}
					</>
				)}
			</div>
		</>
	)
}
