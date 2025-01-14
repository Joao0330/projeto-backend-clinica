import { FaRegUser } from 'react-icons/fa';
import { MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthArea = ({ state }: { state: string }) => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	async function handleLogout() {
		await logout();

		navigate('/');
	}

	return (
		<>
			{state === 'notLoggedIn' ? (
				<>
					<div>
						<FaRegUser />
						<Link to='/login'>login</Link>
					</div>

					<div>
						<FaRegUser />
						<Link to='/register'>registo</Link>
					</div>
				</>
			) : (
				<>
					<div>
						<MdOutlineDashboard />
						<Link to='/dashboard'>Área Utente</Link>
					</div>

					<div>
						<MdLogout />
						<button onClick={handleLogout}>Logout</button>
					</div>
				</>
			)}
		</>
	);
};
