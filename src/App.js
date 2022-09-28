import { dragonActions, userActions } from './data/store'
import { getUser } from './data/firebase'
import { getCookie } from './data/cookie'

import Navigation from './components/UI/Navigation'
import Profile from './components/User/Profile'
import Login from './components/User/LoginRegister'
import Logout from './components/User/Logout'
import Home from './components/UI/Home'




import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'

import './App.sass'


export default function App() {
	const dispatch = useDispatch()
	const user = useSelector(state => state.user.user)
	useEffect(
		() => {

			axios
				.get('https://api.spacexdata.com/v4/dragons')
				.then(res => {
					const dragons = res.data.map(
						(
							{ id, name, flickr_images: imgUrls, description, wikipedia: wikiUrl, launch_payload_mass: { kg: mass }, height_w_trunk: { meters: height }, first_flight: year }
						) => (
							{
								id, name, imgUrls, description, wikiUrl, mass, height, year
							}
						)
					)
					const id = getCookie('user')
					if (id)
						getUser(id)
							.then(userData => dispatch(userActions.login(userData)))
							.catch(e => toast.error(e.message))
					dispatch(dragonActions.set(dragons))
				})
		}, [])

	return <div className='cnt'>
		<Toaster />
		<Router>
			<Navigation />
			<Routes>
				<Route
					path='/login'
					element={
						user
							?
							<Navigate to='/' />
							:
							<Login />
					}
				/>
				<Route
					path='/logout'
					element={
						user
							?
							<Logout />
							:
							<Navigate to='/' />
					}
				/>
				<Route
					path='/profile'
					element={
						user
							?
							<Profile />
							:
							<Navigate to='/' />
					}
				/>
				<Route
					path='/*'
					element={<Home />} />
			</Routes>
		</Router>

	</div>
}

