import { createSlice, configureStore } from '@reduxjs/toolkit'
import { ActionCodeOperation, updateCurrentUser } from 'firebase/auth'

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
		update(state, action) {

			const index = state.list.findIndex(
				({ id }) => id === action.payload.id
			)

			if (index >= 0) {
				Object.keys(action.payload.data).forEach(
					key => state.list[index][key] = action.payload.data[key]
				)
				state.list[index].id = action.payload.id
			}

		}

	}
})


const idsSlice = createSlice({
	name: 'ids of dragons on server',
	initialState: {
		list: []
	},
	reducers: {
		set(state, action) {
			state.list = action.payload
		}
	}
})

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null
	},
	reducers: {
		login(state, action) { state.user = action.payload },
		logout(state) { state.user = null },
		addFavorite(state, action) {
			if (!state.user)
				return
			if (!state.user.favorites)
				state.user.favorites = []

			if (state.user.favorites.includes(action.payload))
				return

			const newFavorites = [...state.user.favorites, action.payload]
			state.user.favorites = newFavorites
		},
		removeFavorite(state, action) {
			if (!state.user)
				return
			if (!state.user.favorites)
				state.user.favorites = []
			const newFavorites = state.user.favorites.filter(
				id => id !== action.payload
			)
			state.user.favorites = newFavorites
		},
		clearFavorite(state) {
			if (!state.user)
				return
			state.user.favorites = []
		}
	}
})
export const dragonsCacheActions = dragonsCacheSlice.actions
export const userActions = userSlice.actions
export const idsActions = idsSlice.actions


const store = configureStore({
	reducer: {
		dragonsCache: dragonsCacheSlice.reducer,
		user: userSlice.reducer,
		ids: idsSlice.reducer
	}
})
export default store