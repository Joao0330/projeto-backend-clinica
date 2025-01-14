import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToHash = () => {
	const { hash } = useLocation();

	useEffect(() => {
		if (hash) {
			const element = document.getElementById(hash.substring(1));

			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
    }, [hash]);
    
    return null;
};
