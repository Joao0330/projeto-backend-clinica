import { useNavigate, useParams } from 'react-router-dom';
import { useEspecialidades } from '../../context/EspecialidadesContext';
import { useFetchEspecialidades } from '../../hooks/useFetchEspecialidades';
import { useEffect, useState } from 'react';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

export const EspecialidadesForm = ({ action }: { action: string }) => {
	const { handleCreate, handleUpdate, handleDelete } = useEspecialidades();
	const { data: especialidades } = useFetchEspecialidades();
	const { id_especialidade } = useParams<{ id_especialidade: string }>();

	const [designacao, setDesignacao] = useState('');

	useIsLoggedIn();

	const navigate = useNavigate();
	const especialidade = especialidades.find(c => c.id === id_especialidade);

	useEffect(() => {
		if (especialidade) {
			setDesignacao(especialidade.designacao ?? '');
		}
	}, [especialidade]);

	const updatedEspecialidade = {
		designacao: designacao,
	};

	return (
		<form
			onSubmit={async e => {
				e.preventDefault();

				if (action === 'create') {
					await handleCreate(designacao);

					navigate('/especialidades');
				} else if (action === 'update') {
					await handleUpdate(id_especialidade as string, updatedEspecialidade);

					navigate('/especialidades');
				} else {
					await handleDelete(id_especialidade as string);
					navigate('/especialidades');
				}
			}}
		>
			<div>
				<label>Designacao</label>
				<input value={designacao} onChange={e => setDesignacao(e.target.value)} required />
			</div>

			<button type='submit' className='form-btn'>
				{action === 'create' ? 'Criar' : action === 'update' ? 'Editar' : 'Apagar'}
			</button>
		</form>
	);
};
