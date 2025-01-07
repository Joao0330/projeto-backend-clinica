import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/AppLayout';
import { HomePage } from './pages/home';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{path: "/", element: <HomePage/>},
		]
	},
]);
