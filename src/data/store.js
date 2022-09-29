import { createSlice, configureStore } from '@reduxjs/toolkit'
import { ActionCodeOperation, updateCurrentUser } from 'firebase/auth'

const dragonsSlice = createSlice({
	name: 'dragons',
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
	name: 'ids of items on server',
	initialState: {
		list: [] 
	},
	reducers: {
		set(state, action) {
			state.list = action.payload
		}
	}
})

const offsetSlice = createSlice({
	name: 'offset on server',
	initialState: {
		value: 0
	},
	reducers: {
		set(state, action) {
			state.value = action.payload
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
export const dragonActions = dragonsSlice.actions
export const userActions = userSlice.actions
export const idsActions = idsSlice.actions
export const offsetActions = offsetSlice.actions


const store = configureStore({
	reducer: {
		dragons: dragonsSlice.reducer,
		user: userSlice.reducer,
		ids: idsSlice.reducer,
		offset: offsetSlice.reducer
	}
})
export default store