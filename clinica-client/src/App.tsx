import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { ConsultasProvider } from './context/ConsultasContext';
import { MedicosProvider } from './context/MedicosContext';
import { PacientesProvider } from './context/PacientesContext';
import { FarmacosProvider } from './context/FarmacosContext';
import { EspecialidadesProvider } from './context/EspecialidadesContext';

export const App = () => {
	return (
		<AuthProvider>
			<MedicosProvider>
				<PacientesProvider>
					<FarmacosProvider>
						<EspecialidadesProvider>
							<ConsultasProvider>
								<RouterProvider router={router} />
							</ConsultasProvider>
						</EspecialidadesProvider>
					</FarmacosProvider>
				</PacientesProvider>
			</MedicosProvider>
		</AuthProvider>
	);
};
