import { useEffect } from 'react';
import { useConsultas } from '../../context/ConsultasContext';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { ConsultasTable } from '../../components/consultas/ConsultasTable';
import { Link } from 'react-router-dom';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useAuth } from '../../context/AuthContext';

export const Consultas = () => {
	const { consultas, getConsultas } = useConsultas();
	const { user } = useAuth();

	useIsLoggedIn();

	useEffect(() => {
		getConsultas();
	}, []);

	console.log(consultas);

	return (
		<section className='consultas'>
			<div className='container'>
				<div className='consultas__wrapper'>
					<div className='consultas__title'>
						<h2>Consultas</h2>
						<p>Obtenha aqui todas as informações acerca das suas consultas.</p>
					</div>

					<div className='consultas__content'>

						{user?.role === "MEDICO" ? (null) : (

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
