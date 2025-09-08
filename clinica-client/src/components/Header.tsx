import { FaHandHoldingMedical } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthArea } from './AuthArea';
import { useState } from 'react';

export const Header = () => {
	const { isLoggedIn } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header>
			<div className='navbar'>
				<div className='container'>
					<div className='navbar__wrapper'>
						<div className='navbar__logo'>
							<h1>clinica</h1>
							<FaHandHoldingMedical />
						</div>

						<nav className={`${isMobileMenuOpen ? 'active' : ''}`}>
							<ul className='navbar__menu'>
								<li>
									<Link to='/' onClick={() => setIsMobileMenuOpen(false)}>
										Inicio
									</Link>
								</li>

								<li>
									<Link
										to={{
											pathname: '/',
											hash: '#about',
										}}
										onClick={() => setIsMobileMenuOpen(false)}
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
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Contacte-nos
									</Link>
								</li>
							</ul>

							<div className='navbar__auth'>
								<AuthArea state={isLoggedIn ? 'loggedIn' : 'notLoggedIn'} toggleMobile={toggleMobileMenu} />
							</div>
						</nav>

						<button className={`navbar__hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
							<span></span>
							<span></span>
							<span></span>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};
