import { useEffect, useState } from 'react';
import { medicos } from '../../models/medicos';
import { useConsultas } from '../../context/ConsultasContext';
import { api } from '../../lib/axios';
import { pacientes } from '../../models/pacientes';
import { medicoEspecialidades } from '../../models/medico-especialidades';

export const CreateConsulta = () => {
	const [medicos, setMedicos] = useState<medicos[]>([]);
	const [pacientes, setPacientes] = useState<pacientes[]>([]);
	const [especialidades, setEspecialidades] = useState<medicoEspecialidades[]>([]);
	const [idMedico, setIdMedico] = useState('');
	const [idPaciente, setIdPaciente] = useState('');
	const [idEspecialidade, setIdEspecialidade] = useState('');
	const [dataInicio, setDataInicio] = useState('');
	const [dataFim, setDataFim] = useState('');
	const { getConsultas } = useConsultas();

	useEffect(() => {
		async function fetchMedicos() {
			const fetchedMedicos = await api.get('/medicos');
			setMedicos(fetchedMedicos.data);
		}
		fetchMedicos();
	}, []);

	useEffect(() => {
		async function fetchPacientes() {
			const fetchedPacientes = await api.get('/pacientes');
			setPacientes(fetchedPacientes.data);
		}
		fetchPacientes();
	}, []);

	useEffect(() => {
		async function fetchEspecialidades() {
			const fetchedEspecialidades = await api.get(`/medicos-especialidades/${idMedico}`);
            setEspecialidades(fetchedEspecialidades.data);

            if (fetchedEspecialidades.data.length === 0) {
                setIdEspecialidade('');
            }
		}
        fetchEspecialidades();
        setEspecialidades([])
	}, [idMedico]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await api.post('/consultas', {
				id_medico: idMedico,
				id_especialidade: idEspecialidade,
				id_paciente: idPaciente,
				data_inicio: dataInicio,
				data_fim: dataFim,
			});

			console.log(idMedico);
			console.log(idEspecialidade);
			console.log(idPaciente);

			alert('Consulta criada com sucesso!');
			getConsultas();
		} catch (err) {
			console.error('Erro ao criar consulta:', err);
			alert('Erro ao criar consulta.');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Criar Consulta</h2>

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

			<button type='submit'>Criar Consulta</button>
		</form>
	);
};
