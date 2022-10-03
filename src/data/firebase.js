import { initializeApp } from 'firebase/app'
import {
	getAuth,
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	EmailAuthProvider,
	sendEmailVerification,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
	updateProfile,
	updatePassword,
	updateEmail,
	sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore'

initializeApp({
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
})

export const auth = getAuth(),
	googleProvider = new GoogleAuthProvider(),
	db = getFirestore()

auth.useDeviceLanguage()
googleProvider.setCustomParameters({
	prompt: 'select_account',
})

const humanErrorText = e => {
	const errText = {
		'auth/weak-password': 'Слабый пароль',
		'auth/wrong-password': 'Неверный пароль',
		'auth/email-already-in-use': 'E-mail уже занят',
		'auth/invalid-email': 'Неправильный email',
		'auth/user-not-found': 'Пользователь не найден',
		'auth/popup-closed-by-user': 'Действие отменено',
		'auth/operation-not-allowed': 'Действие не разрешено',
		'auth/too-many-requests': 'Попробуйте позже',
		'auth/cancelled-popup-request': 'Действие отменено',
		'auth/requires-recent-login': 'Необходим недавний вход в систему',
		'auth/internal-error': 'Внутренняя ошибка',
		'auth/invalid-credential': 'Неверные данные для входа',
		'auth/invalid-verification-code': 'Неверный код подтверждения',
		'auth/invalid-verification-id': 'Неверный идентификатор подтверждения',
	}
	if (e.code) return errText[e.code] || e.code
	else return e.message
}

export const signInGoogle = async () => {
	try {
		const { user } = await signInWithPopup(auth, googleProvider),
			ref = doc(db, 'users', user.uid)
		let userDoc = await getDoc(ref)
		let userData = {}
		if (userDoc.exists()) userData = userDoc.data()
		else {
			const { displayName, email } = user
			userData = {
				displayName,
				email,
				favorites: [],
			}
			await setDoc(ref, userData)
		}
		userData.emailVerified = user.emailVerified
		return userData
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}

export const signIn = async (email, password) => {
	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password),
			ref = doc(db, 'users', user.uid)
		const userData = (await getDoc(ref)).data()
		userData.emailVerified = user.emailVerified
		userData.id = user.uid
		return userData
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}

export const signUp = async (email, password, displayName) => {
	try {
		const { user } = await createUserWithEmailAndPassword(auth, email, password)
		const ref = doc(db, 'users', user.uid),
			userDoc = await getDoc(ref)
		if (userDoc.exists()) throw Error('E-mail уже занят')
		const userData = {
			displayName,
			email,
			favorites: [],
		}
		await setDoc(ref, userData)
		userData.emailVerified = false
		return userData
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}

export const sendLetter = async () => {
	try {
		await sendEmailVerification(auth.currentUser)
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}

export const refreshData = async () => {
	const user = auth.currentUser
	if (user) user.reload()
	return user
}

export const setFavorites = async arr => {
	const user = auth.currentUser
	if (user) {
		try {
			const userRef = doc(db, 'users', user.uid)
			const userDoc = await getDoc(userRef)
			if (!userDoc.exists()) throw Error('Пользователь не существует')
			const userData = userDoc.data()
			userData.favorites = arr

			await setDoc(userRef, userData)
		} catch (e) {
			throw Error(humanErrorText(e))
		}
	}
}

export const getUser = async id => {
	if (id) {
		try {
			const userRef = doc(db, 'users', id)
			const userDoc = await getDoc(userRef)
			if (!userDoc.exists()) return
			return userDoc.data()
		} catch (e) {
			throw Error(humanErrorText(e))
		}
	}
}

const reAuth = async password => {
	const user = auth.currentUser,
		provider = user.providerData[0].providerId
	try {
		if (provider === 'password') {
			const credential = EmailAuthProvider.credential(user.email, password)
			await reauthenticateWithCredential(user, credential)
		} else await reauthenticateWithPopup(googleProvider)
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}

export const updateInfo = async ({
	displayName,
	oldDisplayName,
	email,
	oldEmail,
	password,
	oldPassword,
}) => {
	let user = auth.currentUser
	await reAuth(oldPassword)
	try {
		if (displayName !== oldDisplayName) {
			const userRef = doc(db, 'users', user.uid)
			const userDoc = await getDoc(userRef)
			if (!userDoc.exists()) throw Error('Пользователь не существует')
			const userData = userDoc.data()
			userData.displayName = displayName
			await setDoc(userRef, userData)
			await updateProfile(user, { displayName })
		}
		if (email !== oldEmail) {
			await updateEmail(user, email)
			const userRef = doc(db, 'users', user.uid)
			const userDoc = await getDoc(userRef)
			if (!userDoc.exists()) throw Error('Пользователь не существует')
			const userData = userDoc.data()
			userData.email = email
			await setDoc(userRef, userData)
			await sendEmailVerification(user)
		}

		if (password !== oldPassword && password.trim())
			await updatePassword(user, password)
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}

export const sendResetPasswordLetter = async email => {
	try {
		await sendPasswordResetEmail(auth, email)
	} catch (e) {
		throw Error(humanErrorText(e))
	}
}
