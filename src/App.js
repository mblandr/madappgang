import { dragonActions, userActions } from './data/store'


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
	const user = useSelector(state => state.user.user)
	
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

