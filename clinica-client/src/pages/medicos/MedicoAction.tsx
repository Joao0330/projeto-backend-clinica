import { Link } from 'react-router-dom';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { IoArrowBackOutline } from 'react-icons/io5';
import { MedicosForm } from '../../components/medicos/MedicosForm';

export const MedicoAction = ({ action }: { action: string }) => {
	useIsLoggedIn();

	return (
		<section className='utilForm'>
			<div className='container'>
				<div className='utilForm__wrapper'>
					<div className='utilForm__top'>
						<Link to='/medicos'>
							<IoArrowBackOutline />
						</Link>

						<p>Preencha o formulário abaixo para realizar o que voce deseja</p>
					</div>

					{action === 'create' ? (
						<>
							<h2>Criar Médico</h2>

							<MedicosForm action='create' />
						</>
					) : action === 'update' ? (
						<>
							<h2>Editar Médico</h2>

							<MedicosForm action='update' />
						</>
					) : action === 'delete' ? (
						<>
							<h2>Apagar Médico</h2>

							<MedicosForm action='delete' />
						</>
					) : null}
				</div>
			</div>
		</section>
	);
};
