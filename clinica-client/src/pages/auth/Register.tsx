import { Link } from 'react-router-dom';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { IoExitOutline } from 'react-icons/io5';

export const Register = () => {
	return (
		<div className='auth'>
			<div className='container'>
				<div className='auth__wrapper'>
					<form className='auth__box'>
						<div>
							<IoExitOutline />
						</div>

						<div>
							<FaHandHoldingMedical />
							<h2>Registo</h2>
						</div>

						<p>Faça o seu registo para entrar na sua conta</p>

						<input type='text' placeholder='Nome' aria-label='Nome' required />

						<input type='text' placeholder='Contacto' aria-label='Contacto' />

						<input type='text' placeholder='Morada' aria-label='Morada' />

						<input type='email' placeholder='Email' aria-label='Email' required />

						<input type='password' placeholder='Password' aria-label='password' required />

						<button className='auth-btn' type='submit'>
							Entrar
						</button>

						<small>
							Já possui uma conta?
							<Link to='/login'>Faça o login agora</Link>
						</small>
					</form>
				</div>
			</div>
		</div>
	);
};
