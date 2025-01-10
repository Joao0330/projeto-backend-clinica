import { Link } from 'react-router-dom';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { IoExitOutline } from 'react-icons/io5';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const Login = () => {
	const { register, handleSubmit } = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
	});

	const { login } = useAuth();

	async function handleLogin({ email, password }: LoginFormData) {
		await login(email, password);
	}

	return (
		<div className='auth'>
			<div className='container'>
				<div className='auth__wrapper'>
					<form className='auth__box' onSubmit={handleSubmit(handleLogin)}>
						<div>
							<IoExitOutline />
						</div>

						<div>
							<FaHandHoldingMedical />
							<h2>Login</h2>
						</div>

						<p>Faça login para entrar na sua conta</p>

						<input type='email' placeholder='Email' aria-label='Email' {...register('email')} required />

						<input type='password' placeholder='Password' aria-label='password' {...register('password')} required />

						<button className='auth-btn' type='submit'>
							Entrar
						</button>

						<small>
							Não possui uma conta?
							<Link to='/register'>Registe-se agora</Link>
						</small>
					</form>
				</div>
			</div>
		</div>
	);
};
