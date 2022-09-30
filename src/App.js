import { dragonsCacheActions, userActions, refreshActions, idsActions } from './data/store'


import Navigation from './components/UI/Navigation'
import ResetPassword from './components/User/ResetPassword'
import Profile from './components/User/Profile'
import Login from './components/User/LoginRegister'
import Logout from './components/User/Logout'
import { clearDragons } from './data/localStorage'
import Home from './components/UI/Home'
import { getCookie } from './data/cookie'
import { getUser } from './data/firebase'
import { PullDownContent, ReleaseContent, RefreshContent, PullToRefresh } from 'react-js-pull-to-refresh'



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'

import './App.sass'


export default function App() {
	const user = useSelector(state => state.user.user),
		dispatch = useDispatch(),
		handleRefresh = () => new Promise(resolve => {
			clearDragons()
			dispatch(dragonsCacheActions.clear())
			dispatch(idsActions.clear())
			dispatch(refreshActions.set(true))
			resolve();
		})
	useEffect(
		() => {
			const id = getCookie('user')
			if (id)
				getUser(id)
					.then(userData => dispatch(userActions.login(userData)))
					.catch(e => toast.error(e.message))
		}, [])


	return <div className='cnt'>
		<Toaster />
		<PullToRefresh
			pullDownContent={<PullDownContent />}
			releaseContent={<ReleaseContent />}
			refreshContent={<RefreshContent />}
			pullDownThreshold={100}
			onRefresh={handleRefresh}
			triggerHeight={50}
			backgroundColor='white'
			startInvisible={true}
		>
			<div className='pull-btn'></div>
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
						path='/resetPwd'
						element={
							user
								?
								<Navigate to='/' />
								:
								<ResetPassword />
						}
					/>
					<Route
						path='/*'
						element={<Home />} />
				</Routes>
			</Router>
		</PullToRefresh>

	</div>
}

