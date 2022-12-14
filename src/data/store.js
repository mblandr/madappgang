import { createSlice, configureStore } from '@reduxjs/toolkit'

const refreshSlice = createSlice({
	name: 'refeshing state',
	initialState: { refresh: false },
	reducers: {
		set(state, action) {
			state.refresh = action.payload
		},
	},
})

const cachedImagesSlice = createSlice({
	name: 'cached image urls',
	initialState: { list: [] },
	reducers: {
		add(state, action) {
			state.list.push(action.payload)
		},
	},
})

const dragonsCacheSlice = createSlice({
	name: 'dragons cached in memory',
	initialState: { list: [] },
	reducers: {
		set(state, action) {
			state.list = action.payload
		},
		add(state, action) {
			state.list.push(action.payload)
		},
		clear(state) {
			state.list = []
		},
		update(state, action) {
			const index = state.list.findIndex(({ id }) => id === action.payload.id)

			if (index >= 0) {
				Object.keys(action.payload.data).forEach(
					key => (state.list[index][key] = action.payload.data[key])
				)
				state.list[index].id = action.payload.id
			} else state.list.push(action.payload)
		},
	},
})

const idsSlice = createSlice({
	name: 'ids of dragons on server',
	initialState: {
		list: [],
	},
	reducers: {
		set(state, action) {
			state.list = action.payload
		},
		clear(state) {
			state.list = []
		},
	},
})

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
	},
	reducers: {
		login(state, action) {
			state.user = action.payload
		},
		update(state, action) {
			state.user.displayName = action.payload.displayName
			state.user.email = action.payload.email
		},
		logout(state) {
			state.user = null
		},
		addFavorite(state, action) {
			if (!state.user) return
			if (!state.user.favorites) state.user.favorites = []
			const { id, name } = action.payload
			if (state.user.favorites.includes(id)) return
			const newFavorites = [...state.user.favorites, { id, name }]
			state.user.favorites = newFavorites
		},
		removeFavorite(state, action) {
			if (!state.user) return
			if (!state.user.favorites) state.user.favorites = []
			const newFavorites = state.user.favorites.filter(
				({ id }) => id !== action.payload
			)
			state.user.favorites = newFavorites
		},
		clearFavorite(state) {
			if (!state.user) return
			state.user.favorites = []
		},
	},
})

export const dragonsCacheActions = dragonsCacheSlice.actions
export const userActions = userSlice.actions
export const idsActions = idsSlice.actions
export const refreshActions = refreshSlice.actions
export const cachedImagesActions = cachedImagesSlice.actions

const store = configureStore({
	reducer: {
		dragonsCache: dragonsCacheSlice.reducer,
		user: userSlice.reducer,
		ids: idsSlice.reducer,
		refresh: refreshSlice.reducer,
		imagesCache: cachedImagesSlice.reducer,
	},
})

export default store
