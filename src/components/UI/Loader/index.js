import style from './index.module.sass'

export default function Loader({ className = '' }) {
	return (
		<div className={`${style.wrapper} ${className}`}>
			<div className={style.ring}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	)
}
