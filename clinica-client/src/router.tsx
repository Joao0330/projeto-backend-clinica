import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/AppLayout';
import { HomePage } from './pages/home';
import { Auth } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { Consultas } from './pages/consultas';
import { ConsultaAction } from './pages/consultas/ConsultaAction';
import { Medicos } from './pages/medicos';
import { MedicoAction } from './pages/medicos/MedicoAction';
import { Pacientes } from './pages/pacientes';
import { PacienteAction } from './pages/pacientes/PacienteAction';
import { Farmacos } from './pages/farmacos';
import { FarmacoAction } from './pages/farmacos/FarmacoAction';
import { Especialidades } from './pages/especialidades';
import { EspecialidadeAction } from './pages/especialidades/EspecialidadeAction';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/dashboard', element: <Dashboard /> },

			{ path: '/consultas', element: <Consultas /> },
			{ path: '/consultas/create', element: <ConsultaAction action='create' /> },
			{ path: '/consultas/editar/:id_medico/:id_consulta', element: <ConsultaAction action='update' /> },
			{ path: '/consultas/apagar/:id_medico/:id_consulta', element: <ConsultaAction action='delete' /> },

			{ path: '/medicos', element: <Medicos /> },
			{ path: '/medicos/create', element: <MedicoAction action='create' /> },
			{ path: '/medicos/editar/:id_medico', element: <MedicoAction action='update' /> },
			{ path: '/medicos/apagar/:id_medico', element: <MedicoAction action='delete' /> },

			{ path: '/pacientes', element: <Pacientes /> },
			{ path: '/pacientes/create', element: <PacienteAction action='create' /> },
			{ path: '/pacientes/editar/:id_paciente', element: <PacienteAction action='update' /> },
			{ path: '/pacientes/apagar/:id_paciente', element: <PacienteAction action='delete' /> },

			{ path: '/farmacos', element: <Farmacos /> },
			{ path: '/farmacos/create', element: <FarmacoAction action='create' /> },
			{ path: '/farmacos/editar/:id_farmaco', element: <FarmacoAction action='update' /> },
			{ path: '/farmacos/apagar/:id_farmaco', element: <FarmacoAction action='delete' /> },

			{ path: '/especialidades', element: <Especialidades /> },
			{ path: '/especialidades/create', element: <EspecialidadeAction action='create' /> },
			{ path: '/especialidades/editar/:id_especialidade', element: <EspecialidadeAction action='update' /> },
			{ path: '/especialidades/apagar/:id_especialidade', element: <EspecialidadeAction action='delete' /> },
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
