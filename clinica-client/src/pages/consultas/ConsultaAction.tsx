import { Link } from 'react-router-dom';
import { ConsultaForm } from '../../components/consultas/ConsultaForm';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { IoArrowBackOutline } from 'react-icons/io5';

export const ConsultaAction = ({ action }: { action: string }) => {
	useIsLoggedIn();

	return (
		<section className='consultasForm'>
			<div className='container'>
				<div className='consultasForm__wrapper'>
					<div className='consultasForm__top'>
						<Link to='/consultas'>
							<IoArrowBackOutline />
						</Link>

						<p>Preencha o formulário abaixo para realizar o que voce deseja</p>
					</div>

					{action === 'create' ? (
						<>
							<h2>Criar Consulta</h2>

							<ConsultaForm action='create' />
						</>
					) : action === 'update' ? (
						<>
							<h2>Editar Consulta</h2>

							<ConsultaForm action='update' />
						</>
					) : action === 'delete' ? (
						<>
							<h2>Apagar Consulta</h2>

							<ConsultaForm action='delete' />
						</>
					) : null}
				</div>
			</div>
		</section>
	);
};
