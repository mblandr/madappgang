export const saveDragon = ({ id, ...otherFields }) => {
	const data = JSON.stringify({ ...otherFields })
	localStorage.setItem(`dragon:${id}`, data)
}

export const loadDragon = id => {
	const data = localStorage.getItem(id)
	if (!data) return false
	const result = JSON.parse(data)
	result.id = id
	return result
}

export const clearDragons = () => {
	for (let i = 0; i < localStorage.length; i++) {
		const keyName = localStorage.key(i)
		keyName.startsWith('dragon:') && localStorage.removeItem(keyName)
	}
}

export const clearDragon = id => localStorage.removeItem(`dragon:${id}`)

export const loadImageData = url => localStorage.getItem(`image:${url}`)

export const saveImageData = url => {
	const oldDate = loadImageDate(url)
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(res => {
				let date = res.headers.get('last-modified')
				if (date) date = new Date(date).getTime()
				if (date && oldDate && date <= oldDate) throw Error('Too old')
				return res.blob().then(blob => ({
					date,
					blob,
				}))
			})

			.then(res => {
				const reader = new FileReader()
				reader.onload = () => {
					localStorage.setItem(`image:${url}`, reader.result)
					localStorage.setItem(`date:${url}`, res.date)
					resolve()
				}
				reader.onerror = e => reject(e)
				reader.readAsDataURL(res.blob)
			})
			.catch(e => {
				if (e.message !== 'Too old') reject(e)
			})
	})
}

const loadImageDate = url => {
	const data = localStorage.getItem(`date:${url}`)
	if (!data) return false
	return +data * 1000
}
