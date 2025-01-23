import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { ConsultasProvider } from './context/ConsultasContext';
import { MedicosProvider } from './context/MedicosContext';
import { PacientesProvider } from './context/PacientesContext';
import { FarmacosProvider } from './context/FarmacosContext';

export const App = () => {
	return (
		<AuthProvider>
			<MedicosProvider>
				<PacientesProvider>
					<FarmacosProvider>
						<ConsultasProvider>
							<RouterProvider router={router} />
						</ConsultasProvider>
					</FarmacosProvider>
				</PacientesProvider>
			</MedicosProvider>
		</AuthProvider>
	);
};
