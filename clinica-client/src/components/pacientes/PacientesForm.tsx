import { useNavigate, useParams } from 'react-router-dom';
import { usePacientes } from '../../context/PacientesContext';
import { useFetchPacientes } from '../../hooks/useFetchPacientes';
import { useEffect, useState } from 'react';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

export const PacientesForm = ({ action }: { action: string }) => {
	const { handleCreate, handleUpdate, handleDelete } = usePacientes();
	const { data: pacientes } = useFetchPacientes();
	const { id_paciente } = useParams<{ id_paciente: string }>();

	const [nome, setNome] = useState('');
	const [contacto, setContacto] = useState('');
	const [morada, setMorada] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useIsLoggedIn();

	const navigate = useNavigate();

	const paciente = pacientes.find(c => c.id === id_paciente);

	useEffect(() => {
		if (paciente) {
			setNome(paciente.nome ?? '');
			setContacto(paciente.contacto ?? '');
			setMorada(paciente.morada ?? '');
		}
	}, [paciente]);

	const updatedPaciente = {
		nome: nome,
		contacto: contacto,
		morada: morada,
		email: email,
		password: password,
	};

	return (
		<form
			onSubmit={async e => {
				e.preventDefault();

				if (action === 'create') {
					await handleCreate(nome, contacto, morada, email, password);

					navigate('/pacientes');
				} else if (action === 'update') {
					await handleUpdate(id_paciente as string, updatedPaciente);

					navigate('/pacientes');
				} else {
					await handleDelete(id_paciente as string);
					navigate('/pacientes');
				}
			}}
		>
			<div>
				<label>Nome</label>
				<input value={nome} onChange={e => setNome(e.target.value)} required />
			</div>
			<div>
				<label>Contacto</label>
				<input value={contacto} onChange={e => setContacto(e.target.value)} />
			</div>
			<div>
				<label>Morada</label>
				<input value={morada} onChange={e => setMorada(e.target.value)} />
			</div>
			{action === 'create' && (
				<>
					<div>
						<label>Email</label>
						<input value={email} onChange={e => setEmail(e.target.value)} required />
					</div>
					<div>
						<label>Password</label>
						<input type='password' value={password} onChange={e => setPassword(e.target.value)} required />
					</div>
				</>
			)}
			<button type='submit' className='form-btn'>
				{action === 'create' ? 'Criar' : action === 'update' ? 'Editar' : 'Apagar'}
			</button>
		</form>
	);
};
