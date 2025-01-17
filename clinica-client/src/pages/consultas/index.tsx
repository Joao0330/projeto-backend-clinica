import { useEffect } from 'react';
import { useConsultas } from '../../context/ConsultasContext';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { useAuth } from '../../context/AuthContext';
import { ConsultasTable } from '../../components/consultas/ConsultasTable';

export const Consultas = () => {
	const { consultas, getConsultas } = useConsultas();
	const { isLoggedIn } = useAuth();

	useIsLoggedIn(isLoggedIn);

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
						<ConsultasTable />
					</div>
				</div>
			</div>
		</section>
	);
};
