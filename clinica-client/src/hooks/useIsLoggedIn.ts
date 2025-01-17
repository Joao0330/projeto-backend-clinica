import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useIsLoggedIn = (isLoggedIn: boolean) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login');
		}
	}, [isLoggedIn, navigate]);
};
