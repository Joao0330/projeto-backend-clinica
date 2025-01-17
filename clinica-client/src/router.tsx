import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/AppLayout';
import { HomePage } from './pages/home';
import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { Consultas } from './pages/consultas';
import { CreateConsulta } from './pages/consultas/CreateConsulta';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/consultas', element: <Consultas /> },
			{ path: '/consultas/create', element: <CreateConsulta /> },
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
