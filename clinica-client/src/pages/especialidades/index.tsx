import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { EspecialidadesTable } from '../../components/especialidades/EspecialidadesTable';

export const Especialidades = () => {
	return (
		<section className='utilArea'>
			<div className='container'>
				<div className='utilArea__wrapper'>
					<div className='utilArea__title'>
						<Link to='/dashboard'>
							<IoArrowBackOutline />
						</Link>

						<h2>Especialidades</h2>
						<p>Obtenha aqui todas as informações sobre as especialidades da nossa clínica.</p>
					</div>

					<div className='utilArea__content'>
						<div>
							<Link to='/especialidades/create'>
								<IoIosAddCircleOutline />
								<span>Criar Especialidade</span>
							</Link>
						</div>

						<EspecialidadesTable />
					</div>
				</div>
			</div>
		</section>
	);
};
