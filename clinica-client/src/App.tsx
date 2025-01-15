import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { ConsultasProvider } from './context/ConsultasContext';

export const App = () => {
	return (
		<AuthProvider>
			<ConsultasProvider>
				<RouterProvider router={router} />
			</ConsultasProvider>
		</AuthProvider>
	);
		
};
