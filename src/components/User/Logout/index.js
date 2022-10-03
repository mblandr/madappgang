import { userActions } from '../../../data/store'
import { deleteCookie } from '../../../data/cookie'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
	const dispatch = useDispatch(),
		navigate = useNavigate()
	useEffect(() => {
		navigate('/')
	}, [])
	deleteCookie('user')
	dispatch(userActions.logout())
}
