import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { PacientesTable } from '../../components/pacientes/PacientesTable';
import { IoArrowBackOutline } from 'react-icons/io5';

export const Pacientes = () => {
	const { user } = useAuth();

	return (
		<section className='utilArea'>
			<div className='container'>
				<div className='utilArea__wrapper'>
					<div className='utilArea__title'>
						<Link to='/dashboard'>
							<IoArrowBackOutline />
						</Link>

						<h2>Pacientes</h2>
						<p>Obtenha aqui todas as informações sobre os nossos pacientes.</p>
					</div>

					<div className='utilArea__content'>
						{user?.role === 'ADMIN' && (
							<div>
								<Link to='/pacientes/create'>
									<IoIosAddCircleOutline />
									<span>Criar Paciente</span>
								</Link>
							</div>
						)}

						<PacientesTable />
					</div>
				</div>
			</div>
		</section>
	);
};
