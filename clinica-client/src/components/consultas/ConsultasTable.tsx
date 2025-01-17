import { useAuth } from '../../context/AuthContext';
import { useConsultas } from '../../context/ConsultasContext';

export const ConsultasTable = () => {
	const { consultas } = useConsultas();
	const { user } = useAuth();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
	};

	return (
		<table>
			<thead>
				<tr>
					{user?.role === 'ADMIN' && <th>Número de consulta</th>}
					{user?.role !== 'MEDICO' && <th>Medico</th>}
					{user?.role !== 'UTENTE' && <th>Paciente</th>}
					<th>Especialidade da Consulta</th>
					<th>Data de Inicio</th>
					<th>Data de Fim</th>
				</tr>
			</thead>

			<tbody>
				{consultas.map(consulta => (
					<tr key={consulta.id_consulta}>
						{user?.role === 'ADMIN' && <td>{consulta.numero_consulta}</td>}
						{user?.role !== 'MEDICO' && <td>{consulta.medico.nome}</td>}
						{user?.role !== 'UTENTE' && <td>{consulta.paciente.nome}</td>}
						<td>{consulta.especialidade.designacao}</td>
						<td>{formatDate(consulta.data_inicio)}</td>
						<td>{formatDate(consulta.data_fim)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
