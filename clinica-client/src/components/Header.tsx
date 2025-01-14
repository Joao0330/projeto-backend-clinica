import { FaHandHoldingMedical } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthArea } from './AuthArea';

export const Header = () => {
	const { isLoggedIn } = useAuth();

	return (
		<header>
			<div className='navbar'>
				<div className='container'>
					<div className='navbar__wrapper'>
						<div className='navbar__logo'>
							<h1>clinica</h1>
							<FaHandHoldingMedical />
						</div>

						<nav>
							<ul className='navbar__menu'>
								<li>
									<Link to='/'>Inicio</Link>
								</li>

								<li>
									<Link
										to={{
											pathname: '/',
											hash: '#about',
										}}
									>
										Sobre nós
									</Link>
								</li>

								<li>
									<Link
										to={{
											pathname: '/',
											hash: '#contact',
										}}
									>
										Contacte-nos
									</Link>
								</li>
							</ul>
						</nav>

						<div className='navbar__auth'>
							<AuthArea state={isLoggedIn ? 'loggedIn' : 'notLoggedIn'} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
