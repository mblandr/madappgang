import style from './index.module.sass'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

export default function Navigation() {
	const user = useSelector(state => state.user.user),
		setClassName = ({ isActive }) => (isActive ? style.active : undefined)
	return <nav className={style.nav}>
		<h1>Dragons</h1>
		<ul>
			<li>
				<NavLink
					end
					className={setClassName}
					to='/'>
					Начало
				</NavLink>
			</li>
			{
				user
					?
					<>
						<li>
							<NavLink
								className={setClassName}
								to='/logout'
							>
								Логоут
							</NavLink>
						</li>
						<li>
							<NavLink
								className={setClassName}
								to='/profile'
							>
								Профиль
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