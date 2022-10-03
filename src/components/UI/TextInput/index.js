import { useState } from 'react'

import style from './index.module.sass'

export default function TextInput({
	type = 'text',
	className = '',
	invalid = false,
	label,
	value = '',
	...props
}) {
	const [inputValue, setInputValue] = useState(value),
		onValueChange = e => {
			setInputValue(e.target.value)
			props.onChange && props.onChange(e)
		}
	return (
		<div className={style['input-div']}>
			{label && (
				<label className={inputValue ? style.float : ''}>
					{label}
					{props.required && <span className={style.required}>*</span>}
				</label>
			)}
			{type === 'textarea' ? (
				<textarea
					{...props}
					type={type}
					onChange={onValueChange}
					value={inputValue}
					className={`${invalid ? style.invalid : ''} ${className}`.trim()}
				/>
			) : (
				<input
					{...props}
					className={`${invalid ? style.invalid : ''} ${className}`.trim()}
					type={type}
					onChange={onValueChange}
					value={inputValue}
				/>
			)}
		</div>
	)
}
