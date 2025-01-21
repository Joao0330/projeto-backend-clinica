import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/AppLayout';
import { HomePage } from './pages/home';
import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { Consultas } from './pages/consultas';
import { ConsultaAction } from './pages/consultas/ConsultaAction';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/consultas', element: <Consultas /> },
			{ path: '/consultas/create', element: <ConsultaAction action="create" /> },
			{ path: '/consultas/editar/:id_medico/:id_consulta', element: <ConsultaAction action="update" /> },
			{ path: '/consultas/apagar/:id_medico/:id_consulta', element: <ConsultaAction action="delete" /> },
		],
	},
	{
		path: '/login',
		element: <Auth action='Login' />,
	},
	{
		path: '/register',
		element: <Auth action='Register' />,
	},
]);
