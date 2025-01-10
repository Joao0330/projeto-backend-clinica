import { FaRegUser } from 'react-icons/fa';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

export const Header = () => {
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
									<a href='#'>Inicio</a>
								</li>

								<li>
									<a href='#'>Sobre nós</a>
								</li>

								<li>
									<a href='#'>Contacte-nos</a>
								</li>
							</ul>
						</nav>

						<div className='navbar__auth'>
							<div>
								<FaRegUser />
								<Link to='/login'>login</Link>
							</div>

							<div>
								<FaRegUser />
								<Link to="/register">registo</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
