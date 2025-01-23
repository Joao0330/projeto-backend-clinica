import { useNavigate, useParams } from 'react-router-dom';
import { useFarmacos } from '../../context/FarmacosContext';
import { useFetchFarmacos } from '../../hooks/useFetchFarmacos';
import { useEffect, useState } from 'react';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

export const FarmacosForm = ({ action }: { action: string }) => {
	const { handleCreate, handleUpdate, handleDelete } = useFarmacos();
	const { data: farmacos } = useFetchFarmacos();
	const { id_farmaco } = useParams<{ id_farmaco: string }>();

	const [nome, setNome] = useState('');

	useIsLoggedIn();

	const navigate = useNavigate();
	const farmaco = farmacos.find(c => c.id === id_farmaco);

	useEffect(() => {
		if (farmaco) {
			setNome(farmaco.nome ?? '');
		}
	}, [farmaco]);

	const updatedFarmaco = {
		nome: nome,
	};

	return (
		<form
			onSubmit={async e => {
				e.preventDefault();

				if (action === 'create') {
					await handleCreate(nome);

					navigate('/farmacos');
				} else if (action === 'update') {
					await handleUpdate(id_farmaco as string, updatedFarmaco);

					navigate('/farmacos');
				} else {
					await handleDelete(id_farmaco as string);
					navigate('/farmacos');
				}
			}}
		>
			<div>
				<label>Nome</label>
				<input value={nome} onChange={e => setNome(e.target.value)} required />
			</div>

			<button type='submit' className='form-btn'>
				{action === 'create' ? 'Criar' : action === 'update' ? 'Editar' : 'Apagar'}
			</button>
		</form>
	);
};
