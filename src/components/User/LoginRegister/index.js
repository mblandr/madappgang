import style from './index.module.sass'

import TextInput from '../../UI/TextInput'
import { signIn, signInGoogle, signUp, sendLetter, refreshData, reAuth } from '../../../data/firebase'
import { userActions } from '../../../data/store'
import { setCookie } from '../../../data/cookie'

import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from '../../UI/Button'

export default function LoginRegister() {
	const dispatch = useDispatch(),
		navigate = useNavigate(),
		[formData, setFormData] = useState({
			email: '',
			displayName: '',
			password: '',
			confirmPassword: '',
			newUser: false,
			saveUser: false
		}),

		handleSignInGoogle = async e => {
			try {
				const userData = await signInGoogle()
				toast('Вход выполнен')
				dispatch(
					userActions.login({
						displayName: userData.displayName,
						email: userData.email,
						favorites: userData.favorites,
					})
				)
				return navigate('/')

			}
			catch (e) {
				toast.error(e.message)
			}
		},
		handleSubmitForm = async e => {
			e.preventDefault()
			const id = e.nativeEvent.submitter.id
			try {
				if (id === 'signIn') {
					const userData = await signIn(formData.email, formData.password)
					const { emailVerified } = await refreshData()
					//let emailVerified = userData.emailVerified
					//if (!emailVerified)
					//	emailVerified = await refreshData()
					if (!emailVerified) {
						toast.error('Email не подтвержден')
						await sendLetter()
						toast('Подтверждающее письмо отправлено на email')
					}
					else {
						dispatch(
							userActions.login({
								displayName: userData.displayName,
								email: userData.email,
								favorites: userData.favorites,
							})
						)
						if (formData.saveUser)
							setCookie('user', userData.id, { 'max-age': 3600 * 24 * 30 })
						return navigate('/')
					}
				}
				else if (id === 'signUp') {
					await signUp(formData.email, formData.password, formData.displayName)
					toast('Регистрация завершена')
					await sendLetter()
					toast('Подтверждающее письмо отправлено на email')
					setFormData({
						...formData,
						newUser: false
					})
				}

			}
			catch (e) {
				toast.error(e.message)
			}
		},

		handleFormChange = e => {
			if (e.target.name === 'newUser')
				setFormData({
					...formData,
					newUser: e.target.checked
				})
			else
				setFormData({
					...formData,
					[e.target.name]: e.target.value
				})

		}
	return (
		<form
			className={style.form}
			onSubmit={handleSubmitForm}
		>
			<label>
				<input
					name='newUser'
					checked={formData.newUser}
					onChange={handleFormChange}
					className={style.checkbox}
					type='checkbox'
				/>
				Я новый пользователь
			</label>

			<TextInput
				name='email'
				className='input'
				type='email'
				required
				label='E-mail'
				onChange={handleFormChange}
			/>

			{
				formData.newUser
				&&
				<TextInput
					name='displayName'
					className='input'
					required
					label='Имя'
					onChange={handleFormChange}
				/>
			}

			<TextInput
				name='password'
				className='input'
				type='password'
				required
				invalid={formData.newUser && formData.password !== formData.confirmPassword}
				label='Пароль'
				onChange={handleFormChange}
			/>

			{
				formData.newUser
				&&
				< TextInput
					name='confirmPassword'
					className='input'
					type='password'
					required
					invalid={formData.newUser && (formData.password !== formData.confirmPassword)}
					label='Повторите пароль'
					onChange={handleFormChange}
				/>
			}
			{
				!formData.newUser
				&&
				<div className={style.boxes}>
					<label>
						<input
							name='saveUser'
							checked={formData.saveUser}
							onChange={handleFormChange}
							className={style.checkbox}
							type='checkbox'
						/>
						Запомнить
					</label>
					<Link to='/resetPwd'>Забыли пароль?</Link>
				</div>
			}
			<div className={style.btns}>
				{
					formData.newUser
						?

						<Button
							className={style.button}
							id='signUp'
						>
							Регистрация
						</Button>
						:
						<>
							<Button
								id='signIn'
								className={style.button}
							>
								Вход
							</Button>
							<Button
								className={style['button-alt']}
								google
								type="button"
								onClick={handleSignInGoogle}
							>
								
								Вход с Google
							</Button>
						</>
				}
			</div>
		</form>
	)
}
