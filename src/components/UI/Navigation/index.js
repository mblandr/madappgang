import style from './index.module.sass'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from './logo.png'
import { useDeferredValue } from 'react'

export default function Navigation() {
	const user = useSelector(state => state.user.user),
		setClassName = ({ isActive }) => (isActive ? style.active : undefined)
	return <nav className={style.nav}>
		<NavLink
			end
			className={setClassName}
			to='/'>
			<img src={logo} alt="DragonX" />
		</NavLink>
		<ul>
			{
				user
					?
					<>

						<li>
							Привет,	<NavLink
								className={setClassName}
								to='/profile'
							>
								{user.displayName}
							</NavLink>
						</li>
						<li>
							<NavLink
								className={setClassName}
								to='/logout'
							>
								выход
							</NavLink>
						</li>
					</>
					:
					<li>
						<NavLink
							className={setClassName}
							to='/login'
						>
							Логин
						</NavLink>
					</li>
			}
		</ul>
	</nav>
}