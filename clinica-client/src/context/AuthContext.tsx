/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../models/user';
import { api } from '../lib/axios';

interface AuthContextData {
	isLoggedIn: boolean;
	user: User | undefined;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

const storageKey = 'auth-token';

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | undefined>();
	const [token, setToken] = useState<string | undefined>(() => {
		const storedToken = localStorage.getItem(storageKey);

		if (!storedToken) {
			return undefined;
		}

		return storedToken;
	});

	const login = async (email: string, password: string) => {
		try {
			const { data } = await api.post('/login', { email, password });

			if (data) {
				setToken(data.token);
				localStorage.setItem(storageKey, data.token);

                alert('Logado com sucesso');
                console.log(token)
			}
		} catch (err) {
			console.error(err);
			alert('Erro ao logar');
		}
	};

	async function logout() {
		await api.post('/logout');
		localStorage.removeItem(storageKey);

		setUser(undefined);
		setToken(undefined);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoggedIn: !!token,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
