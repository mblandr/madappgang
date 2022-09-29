export const saveDragon = ({ id, imgUrls, ...otherFields }) => {
	const canvas = document.createElement('canvas');
	const imgPromises = imgUrls.map(
		image => new Promise(
			(resolve, reject) => {
				if (image instanceof HTMLElement) {
					const ctx = canvas.getContext('2d')
					canvas.height = image.naturalHeight
					canvas.width = image.naturalWidth
					ctx.drawImage(image, 0, 0)
					resolve(canvas.toDataURL())
				}
				else {
					fetch(image)
						.then(
							(res) => res.blob()
						)
						.then(
							(blob) => {
								const reader = new FileReader()
								reader.onload = () => resolve(reader.result)
								reader.onerror = e => reject(e)
								reader.readAsDataURL(blob);
							}
						)
						.catch(e => reject(e))

				}
			}
		)
	)
	return Promise
		.allSettled(imgPromises)
		.then(
			results => {
				const imgUrls = results.map(
					result => result.status === 'fulfilled' ? result.value : ''
				)
				const data = JSON.stringify({ imgUrls, ...otherFields })
				localStorage.setItem(id, data)
				return data
			}
		)
}


export const loadDragon = id => {
	const data = localStorage.getItem(id)
	if (!data)
		return false

	const result = JSON.parse(data)
	result.id = id
	return result


}
