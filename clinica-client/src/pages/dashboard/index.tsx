import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import dashboardCardsContent from '../../data/dashboard/dashboard-cards.json';
import { DashboardCards } from '../../components/dashboard/DashboardCards';

export const Dashboard = () => {
	const { isLoggedIn, user } = useAuth();
	const role = user?.role;
	const cards = role !== undefined ? dashboardCardsContent[role] : [];

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
					<div className='dashboard__content'>
						<div className='dashboard__content-title'>
							<h2>
								Bem-vindo <strong>{user?.nome}</strong> à área de utente
							</h2>
							<p>No seu painel de controlo, pode visualizar e gerir os seus dados pessoais, as suas consultas e os seus tratamentos.</p>
						</div>

						<div className='dashboard__content-cards'>
							{cards.map(card => (
								<DashboardCards key={card.id} title={card.title} text={card.text} url={card.url} />
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
