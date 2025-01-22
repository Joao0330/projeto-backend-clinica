import { useEffect, useState } from 'react';
import { useMedicos } from '../../context/MedicosContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchMedicos } from '../../hooks/useFetchMedicos';

export const MedicosForm = ({ action }: { action: string }) => {
	const { handleCreate, handleUpdate, handleDelete } = useMedicos();
	const { data: medicos } = useFetchMedicos();
	const { id_medico } = useParams<{ id_medico: string }>();

	const [nome, setNome] = useState('');
	const [contacto, setContacto] = useState('');
	const [morada, setMorada] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const medico = medicos.find(c => c.id === id_medico);

	useEffect(() => {
		if (medico) {
			setNome(medico.nome ?? '');
			setContacto(medico.contacto ?? '');
			setMorada(medico.morada ?? '');
			/* setEmail(medico.User.email ?? ''); */
		}
	}, [medico]);

	const updatedMedico = {
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

					navigate('/medicos');
				} else if (action === 'update') {
					await handleUpdate(id_medico as string, updatedMedico);

					navigate('/medicos');
				} else {
					await handleDelete(id_medico as string);
					navigate('/medicos');
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
