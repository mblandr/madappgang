import style from './index.module.sass'
import DragonsList from '../../Data/DragonsList'
import Dragon from '../../Data/Dragon'

import { Routes, Route, Outlet } from 'react-router-dom'

export default function Home() {
	return (
		<>
			<Routes>
				<Route index element={<DragonsList />} />
				<Route path=':id' element={<Dragon />} />
			</Routes>
			<Outlet />
		</>
	)
}
