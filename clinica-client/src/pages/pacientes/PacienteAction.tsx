import { Link } from "react-router-dom";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";
import { IoArrowBackOutline } from "react-icons/io5";
import { PacientesForm } from "../../components/pacientes/PacientesForm";

export const PacienteAction = ({ action }: { action: string }) => {
	useIsLoggedIn();

	return (
		<section className='utilForm'>
			<div className='container'>
				<div className='utilForm__wrapper'>
					<div className='utilForm__top'>
						<Link to='/pacientes'>
							<IoArrowBackOutline />
						</Link>

						<p>Preencha o formulário abaixo para realizar o que voce deseja</p>
					</div>

					{action === 'create' ? (
						<>
							<h2>Criar Paciente</h2>

							<PacientesForm action='create' />
						</>
					) : action === 'update' ? (
						<>
							<h2>Editar Paciente</h2>

							<PacientesForm action='update' />
						</>
					) : action === 'delete' ? (
						<>
							<h2>Apagar Paciente</h2>

							<PacientesForm action='delete' />
						</>
					) : null}
				</div>
			</div>
		</section>
	);
};