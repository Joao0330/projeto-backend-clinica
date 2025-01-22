import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MedicosTable } from "../../components/medicos/MedicosTable";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";

export const Medicos = () => {
    const { user } = useAuth();

	useIsLoggedIn();

  return (
		<section className='utilArea'>
			<div className='container'>
				<div className='utilArea__wrapper'>
					<div className='utilArea__title'>
						<h2>Médicos</h2>
						<p>Obtenha aqui todas as informações sobre os nossos médicos.</p>
					</div>

					<div className='utilArea__content'>
						{user?.role === 'ADMIN' && (
							<div>
								<Link to='/medicos/create'>
									<IoIosAddCircleOutline />
									<span>Criar Médico</span>
								</Link>
							</div>
						)}

						<MedicosTable />
					</div>
				</div>
			</div>
		</section>
	);
}

