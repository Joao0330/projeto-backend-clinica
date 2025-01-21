import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useIsLoggedIn = () => {
	const {isLoggedIn} = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login');
		}
	}, [isLoggedIn, navigate]);
};
