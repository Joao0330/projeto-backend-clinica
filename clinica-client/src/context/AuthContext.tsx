/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../models/user';
import { api } from '../lib/axios';

interface AuthContextData {
	isLoggedIn: boolean;
	user: User | undefined;
	login: (email: string, password: string) => Promise<boolean>;
	authRegister: (nome: string, email: string, password: string, contacto?: string, morada?: string) => Promise<void>;
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

				const userResponse = await api.get('/me');
				setUser(userResponse.data);

				alert('Logado com sucesso');
				return true;
			}
		} catch (err) {
			console.error(err);
			alert('Erro ao logar');
		}
		return false;
	};

	const authRegister = async (nome: string, email: string, password: string, contacto?: string, morada?: string) => {
		try {
			const { data } = await api.post('/register', { nome, contacto, morada, email, password });

			if (data) {
				alert('Registado com sucesso');
			}
		} catch (err) {
			console.error(err);
			alert('Erro ao fazer o registo');
		}
	};

	async function logout() {
		localStorage.removeItem(storageKey);

		setUser(undefined);
		setToken(undefined);
	}

	useEffect(() => {
		const initializeAuth = async () => {
			if (token) {
				try {
					api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

					const { data } = await api.get('/me');
					setUser(data);
				} catch (err) {
					console.error('Erro ao inicializar autenticação:', err);
					logout();
				}
			}
		};

		initializeAuth();
	}, [token]);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoggedIn: !!token,
				login,
				authRegister,
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
