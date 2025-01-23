import { Link } from "react-router-dom";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";
import { IoArrowBackOutline } from "react-icons/io5";
import { FarmacosForm } from "../../components/farmacos/FarmacosForm";

export const FarmacoAction = ({ action }: { action: string }) => {
    useIsLoggedIn();

  return (
		<section className='utilForm'>
			<div className='container'>
				<div className='utilForm__wrapper'>
					<div className='utilForm__top'>
						<Link to='/farmacos'>
							<IoArrowBackOutline />
						</Link>

						<p>Preencha o formulário abaixo para realizar o que voce deseja</p>
					</div>

					{action === 'create' ? (
						<>
							<h2>Criar Fármaco</h2>

							<FarmacosForm action='create' />
						</>
					) : action === 'update' ? (
						<>
							<h2>Editar Fármaco</h2>

							<FarmacosForm action='update' />
						</>
					) : action === 'delete' ? (
						<>
							<h2>Apagar Fármaco</h2>

							<FarmacosForm action='delete' />
						</>
					) : null}
				</div>
			</div>
		</section>
	);
}