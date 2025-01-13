import { Link } from 'react-router-dom';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { IoExitOutline } from 'react-icons/io5';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';

const registerFormSchema = z.object({
	nome: z.string().min(1),
	contacto: z.string().min(9).optional(),
	morada: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(6),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export const Register = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerFormSchema),
	});

	const { authRegister } = useAuth();

	async function handleRegister({ nome, email, password, contacto, morada }: RegisterFormData) {
		await authRegister(nome, email, password, contacto, morada);
	}

	return (
		<div className='auth'>
			<div className='container'>
				<div className='auth__wrapper'>
					<form className='auth__box' onSubmit={handleSubmit(handleRegister)}>
						<Link to='/'>
							<IoExitOutline />
						</Link>

						<div>
							<FaHandHoldingMedical />
							<h2>Registo</h2>
						</div>

						<p>Faça o seu registo para entrar na sua conta</p>

						<input type='text' placeholder='Nome' aria-label='Nome' {...register('nome')} required />

						<input type='text' placeholder='Contacto' aria-label='Contacto' {...register('contacto')} />
						{errors.contacto && (
							<div>
								<p>O contacto deve ter no mínimo 6 caracteres</p>
							</div>
						)}

						<input type='text' placeholder='Morada' aria-label='Morada' {...register('morada')} />

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
							Registe-se
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
