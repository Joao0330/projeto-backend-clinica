import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';

export const Dashboard = () => {
	const { isLoggedIn, user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login');
		}
	});

	return (
		<section className='dashboard'>
			<div className='container'>
				<div className='dashboard__wrapper'>
					<aside className='dashboard__sidebar'>
						<div className='dashboard__sidebar-profile'>
							<FaUserCircle />
							<strong>{user?.nome}</strong>
							<strong>{user?.role}</strong>
						</div>

						<div className='dashboard__sidebar-content'>
							<ul>
								{user?.role === 'ADMIN' ? (
									<>
										<li>Médicos</li>
										<li>Pacientes</li>
										<li>Consultas</li>
										<li>Receitas</li>
										<li>Fármacos</li>
									</>
								) : user?.role === 'MEDICO' ? (
									<>
										<li>Consultas</li>
										<li>Receitas</li>
										<li>Fármacos</li>
									</>
								) : (
									<>
										<li>Consultas</li>
									</>
								)}
							</ul>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
};
