import { Link, useNavigate } from 'react-router-dom';
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
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
	});

	const { login } = useAuth();
	const navigate = useNavigate();

	async function handleLogin({ email, password }: LoginFormData) {
		const tryLogin = await login(email, password);
		
		if (tryLogin) {
			navigate('/dashboard');
		}
	}

	return (
		<div className='auth'>
			<div className='container'>
				<div className='auth__wrapper'>
					<form className='auth__box' onSubmit={handleSubmit(handleLogin)}>
						<Link to='/'>
							<IoExitOutline />
						</Link>

						<div>
							<FaHandHoldingMedical />
							<h2>Login</h2>
						</div>

						<p>Faça login para entrar na sua conta</p>

						<input type='email' placeholder='Email' aria-label='Email' {...register('email')} required />
						{errors.email && (
							<div>
								<p>Email inválido</p>
							</div>
						)}

						<input type='password' placeholder='Password' aria-label='password' {...register('password')} required />
						{errors.password && (
							<div>
								<p>A password deve ter no mínimo 6 caracteres</p>
							</div>
						)}

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
