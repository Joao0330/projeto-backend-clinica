import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/sidebar/Sidebar';

export const Dashboard = () => {
	const { isLoggedIn } = useAuth();
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
					<Sidebar />
				</div>
			</div>
		</section>
	);
};
