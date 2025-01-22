import { useEffect } from 'react';
import { useConsultas } from '../../context/ConsultasContext';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { ConsultasTable } from '../../components/consultas/ConsultasTable';
import { Link } from 'react-router-dom';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useAuth } from '../../context/AuthContext';
import { IoArrowBackOutline } from 'react-icons/io5';

export const Consultas = () => {
	const { consultas, getConsultas } = useConsultas();
	const { user } = useAuth();

	useIsLoggedIn();

	useEffect(() => {
		getConsultas();
	}, []);

	console.log(consultas);

	return (
		<section className='utilArea'>
			<div className='container'>
				<div className='utilArea__wrapper'>
					<div className='utilArea__title'>
						<Link to='/dashboard'>
							<IoArrowBackOutline />
						</Link>

						<h2>Consultas</h2>
						<p>Obtenha aqui todas as informações acerca das suas consultas.</p>
					</div>

					<div className='utilArea__content'>
						{user?.role === 'MEDICO' ? null : (
							<div>
								<Link to='/consultas/create'>
									<IoIosAddCircleOutline />
									<span>Marcar Consulta</span>
								</Link>
							</div>
						)}

						<ConsultasTable />
					</div>
				</div>
			</div>
		</section>
	);
};
