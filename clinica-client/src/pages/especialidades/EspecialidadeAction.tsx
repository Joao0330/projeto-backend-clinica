import { Link } from 'react-router-dom';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { IoArrowBackOutline } from 'react-icons/io5';
import { EspecialidadesForm } from '../../components/especialidades/EspecialidadesForm';

export const EspecialidadeAction = ({ action }: { action: string }) => {
	useIsLoggedIn();

	return (
		<section className='utilForm'>
			<div className='container'>
				<div className='utilForm__wrapper'>
					<div className='utilForm__top'>
						<Link to='/especialidades'>
							<IoArrowBackOutline />
						</Link>

						<p>Preencha o formulário abaixo para realizar o que voce deseja</p>
					</div>

					{action === 'create' ? (
						<>
							<h2>Criar Especialidade</h2>

							<EspecialidadesForm action='create' />
						</>
					) : action === 'update' ? (
						<>
							<h2>Editar Especialidade</h2>

							<EspecialidadesForm action='update' />
						</>
					) : action === 'delete' ? (
						<>
							<h2>Apagar Especialidade</h2>

							<EspecialidadesForm action='delete' />
						</>
					) : null}
				</div>
			</div>
		</section>
	);
};
