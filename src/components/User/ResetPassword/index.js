import { sendResetPasswordLetter } from '../../../data/firebase'

import TextInput from '../../UI/TextInput'
import Button from '../../UI/Button'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

import style from './index.module.sass'

export default function ResetPassword() {
	const [email, setEmail] = useState(''),
		handleSubmitForm = async e => {
			e.preventDefault()
			try {
				await sendResetPasswordLetter(email)
				toast('Письмо со сбросом пароля отправлено')
			} catch (e) {
				toast.error(e.message)
			}
		},
		handleFormChange = e => {
			setEmail(e.target.value)
		}
	return (
		<form className={style.form} onSubmit={handleSubmitForm}>
			<TextInput
				required
				label='Email'
				name='email'
				onChange={handleFormChange}
				value={email}
				type='email'
			/>

			<Button className={style.btn}>Сбросить пароль</Button>
		</form>
	)
}
