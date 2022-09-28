import { userActions } from '../../../data/store'
import { deleteCookie } from '../../../data/cookie'

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

export default function Logout() {

	const dispatch = useDispatch(),
		navigate = useNavigate()
	useEffect(
		() => { navigate('/') },
		[]
	)
	deleteCookie('user')
	dispatch(userActions.logout())

}
