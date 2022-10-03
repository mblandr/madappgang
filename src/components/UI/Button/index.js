import { ReactComponent as GoogleIcon } from './google.svg'
import style from './index.module.sass'

export default function Button({
	children,
	className = '',
	google,
	onCLick,
	...props
}) {
	return (
		<button
			className={`${
				google ? style['btn-google'] : style.btn
			} ${className}`.trim()}
			{...props}
		>
			{google && <GoogleIcon className={style.icon} />}
			{children}
		</button>
	)
}
