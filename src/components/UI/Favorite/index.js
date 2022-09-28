import { ReactComponent as UnFav } from './unfav.svg'
import { ReactComponent as Fav } from './fav.svg'
import style from './index.module.sass'

export default function Favorite({ isFavorite = false, onChangeIsFavorite, className = '' }) {
	const handleClick = () => onChangeIsFavorite && onChangeIsFavorite()

	return (
		<div
			onClick={handleClick}
			className={`${style.wrap} ${className}`.trim()}
		>
			{
				isFavorite
					?
					<Fav />
					:
					<UnFav />
			}
		</div>
	)
}
