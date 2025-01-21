import { useConsultas } from '../../context/ConsultasContext';
import { useFetchMedicos } from '../../hooks/useFetchMedicos';
import { useFetchPacientes } from '../../hooks/useFetchPacientes';
import { useFetchEspecialidades } from '../../hooks/useFetchEspecialidades';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';
import { useAuth } from '../../context/AuthContext';

export const ConsultaForm = ({ action }: { action: string }) => {
	const { handleCreate, handleUpdate, handleDelete, consultas } = useConsultas();
	const { id_medico, id_consulta } = useParams<{ id_medico: string; id_consulta: string }>();
	const { user } = useAuth();

	const consulta = consultas.find(c => c.id_consulta === id_consulta);

	const [idPaciente, setIdPaciente] = useState('');
	const [dataInicio, setDataInicio] = useState('');
	const [dataFim, setDataFim] = useState('');
	const { data: medicos } = useFetchMedicos();
	const { data: pacientes } = useFetchPacientes();
	const { data: especialidades, idMedico, setIdMedico, idEspecialidade, setIdEspecialidade } = useFetchEspecialidades();

	useIsLoggedIn();

	useEffect(() => {
		if (user && user.role === 'UTENTE') {
			setIdPaciente(user?.paciente?.id);
		}
	}, [user, setIdPaciente]);

	useEffect(() => {
		if (consulta) {
			setIdPaciente(consulta.id_paciente ?? '');
			setIdMedico(consulta.id_medico ?? '');
			setIdEspecialidade(consulta.id_especialidade ?? '');
			setDataInicio(consulta ? new Date(consulta.data_inicio).toLocaleString('sv-SE').replace(' ', 'T') : '');
			setDataFim(consulta ? new Date(consulta.data_fim).toLocaleString('sv-SE').replace(' ', 'T') : '');
		}
	}, [consulta, setIdMedico, setIdEspecialidade]);

	const navigate = useNavigate();

	const updatedConsulta = {
		id_medico: idMedico,
		id_especialidade: idEspecialidade,
		id_paciente: idPaciente,
		data_inicio: dataInicio,
		data_fim: dataFim,
	};

	return (
		<form
			onSubmit={async e => {
				e.preventDefault();

				if (action === 'create') {
					if (user && user.role === 'UTENTE') {
						await handleCreate(idMedico, idEspecialidade, user?.paciente?.id, dataInicio, dataFim);
					} else {
						await handleCreate(idMedico, idEspecialidade, idPaciente, dataInicio, dataFim);
					}
					navigate('/consultas');
				} else if (action === 'update') {
					await handleUpdate(id_medico as string, id_consulta as string, updatedConsulta);

					navigate('/consultas');
				} else if (action === 'delete') {
					await handleDelete(id_medico as string, id_consulta as string);

					navigate('/consultas');
				}
			}}
		>
			<div>
				<label htmlFor='idMedico'>Médico:</label>
				<select id='idMedico' value={idMedico} onChange={e => setIdMedico(e.target.value)} required>
					<option value='' disabled>
						Selecione um médico
					</option>
					{medicos.map(medico => (
						<option key={medico.id} value={medico.id}>
							{medico.nome}
						</option>
					))}
				</select>
			</div>

			{user?.role !== 'UTENTE' && (
				<div>
					<label htmlFor='idPaciente'>Paciente:</label>
					<select id='idPaciente' value={idPaciente} onChange={e => setIdPaciente(e.target.value)} required>
						<option value='' disabled>
							Selecione um paciente
						</option>
						{pacientes.map(paciente => (
							<option key={paciente.id} value={paciente.id}>
								{paciente.nome}
							</option>
						))}
					</select>
				</div>
			)}

			<div>
				<label htmlFor='idEspecialidade'>Especialidade:</label>
				<select id='idEspecialidade' value={idEspecialidade} onChange={e => setIdEspecialidade(e.target.value)} required>
					<option value='' disabled>
						Selecione uma especialidade
					</option>
					{especialidades.map(especialidade => (
						<option key={especialidade.id_especialidade} value={especialidade.id_especialidade}>
							{especialidade.especialidade.designacao}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor='dataInicio'>Data de Início:</label>
				<input type='datetime-local' id='dataInicio' value={dataInicio} onChange={e => setDataInicio(e.target.value)} required />
			</div>

			<div>
				<label htmlFor='dataFim'>Data de Fim:</label>
				<input type='datetime-local' id='dataFim' value={dataFim} onChange={e => setDataFim(e.target.value)} required />
			</div>

			<button type='submit' className='consulta-btn'>
				{action === 'create' ? 'Criar' : action === 'update' ? 'Editar' : 'Apagar'}
			</button>
		</form>
	);
};
