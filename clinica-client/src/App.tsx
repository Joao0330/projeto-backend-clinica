import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { ConsultasProvider } from './context/ConsultasContext';
import { MedicosProvider } from './context/MedicosContext';

export const App = () => {
	return (
		<AuthProvider>
			<MedicosProvider>
				<ConsultasProvider>
					<RouterProvider router={router} />
				</ConsultasProvider>
			</MedicosProvider>
		</AuthProvider>
	);
		
};
