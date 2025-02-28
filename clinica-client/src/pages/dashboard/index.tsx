import { useAuth } from '../../context/AuthContext';
import dashboardCardsContent from '../../data/dashboard/dashboard-cards.json';
import { DashboardCards } from '../../components/dashboard/DashboardCards';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

export const Dashboard = () => {
	const { user } = useAuth();
	const role = user?.role;
	const cards = role !== undefined ? dashboardCardsContent[role] : [];

	useIsLoggedIn();

	return (
		<section className='dashboard'>
			<div className='container'>
				<div className='dashboard__wrapper'>
					<div className='dashboard__content'>
						<div className='dashboard__content-title'>
							<h2>
								Bem-vindo <strong>{user?.nome}</strong> à área de utente
							</h2>
							<p>No seu painel de controlo, pode visualizar e gerir os seus dados pessoais, as suas consultas e muito mais.</p>
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
