import store from './data/store'

import App from './App'

import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

createRoot(document.querySelector('#root')).render(
	<Provider store={store}>
		<App />
	</Provider>
)
