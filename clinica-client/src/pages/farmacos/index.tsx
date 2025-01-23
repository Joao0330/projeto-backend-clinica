import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { FarmacosTable } from "../../components/farmacos/FarmacosTable";

export const Farmacos = () => {
    const { user } = useAuth();

  return (
		<section className='utilArea'>
			<div className='container'>
				<div className='utilArea__wrapper'>
					<div className='utilArea__title'>
						<Link to='/dashboard'>
							<IoArrowBackOutline />
						</Link>

						<h2>Fármacos</h2>
						<p>Obtenha aqui todas as informações sobre os nossos fármacos.</p>
					</div>

					<div className='utilArea__content'>
						{user?.role === 'ADMIN' && (
							<div>
								<Link to='/farmacos/create'>
									<IoIosAddCircleOutline />
									<span>Criar Fármaco</span>
								</Link>
							</div>
						)}

						<FarmacosTable />
					</div>
				</div>
			</div>
		</section>
	);
}