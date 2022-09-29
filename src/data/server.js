import axios from 'axios'

export const getDragons = () =>
	axios
		.post(
			'https://api.spacexdata.com/v4/dragons/query',
			{
				options: {
					select: 'id'
				}
			}
		)
		.then(result => {
			console.log('returned items', result.data.docs)
			return result.data.docs.map(({ id }) => id)
		})

export const getDragon = id => {
	console.log('requester dragon', id)
	return axios
		.post(
			'https://api.spacexdata.com/v4/dragons/query',
			{
				query: {
					_id: id
				},
				"options": {
					select: "id name flickr_images description wikipedia launch_payload_mass height_w_trunk first_flight",
				}
			}
		)
		.then(result => {
			if (result.data.docs.length === 1) {
				const { id, name, flickr_images: imgUrls, description, wikipedia: wikiUrl, launch_payload_mass: { kg: mass }, height_w_trunk: { meters: height }, first_flight: year } = result.data.docs[0]
				return { id, name, imgUrls, description, wikiUrl, mass, height, year }
			}
		})
}	
