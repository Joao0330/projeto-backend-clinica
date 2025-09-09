import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConsultas } from '../../context/ConsultasContext';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';

export const ConsultasTable = () => {
	const { consultas } = useConsultas();
	const { user } = useAuth();

	const sortedConsultas = consultas.sort((a, b) => a.numero_consulta - b.numero_consulta);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
	};

	return (
		<div className='table-container'>
			<table className='table'>
				<thead>
					<tr>
						{user?.role === 'ADMIN' && <th>Número de consulta</th>}
						{user?.role !== 'MEDICO' && <th>Medico</th>}
						{user?.role !== 'UTENTE' && <th>Paciente</th>}
						<th>Especialidade da Consulta</th>
						<th>Data de Inicio</th>
						<th>Data de Fim</th>
						{user?.role === 'ADMIN' && <th>Editar</th>}
						{user?.role === 'ADMIN' && <th>Apagar</th>}
					</tr>
				</thead>

				<tbody>
					{sortedConsultas.map(consulta => (
						<tr key={consulta.id_consulta}>
							{user?.role === 'ADMIN' && <td>{consulta.numero_consulta}</td>}
							{user?.role !== 'MEDICO' && <td>{consulta.medico.nome}</td>}
							{user?.role !== 'UTENTE' && <td>{consulta.paciente.nome}</td>}
							<td>{consulta.especialidade.designacao}</td>
							<td>{formatDate(consulta.data_inicio)}</td>
							<td>{formatDate(consulta.data_fim)}</td>
							{user?.role === 'ADMIN' && (
								<td>
									<Link to={`/consultas/editar/${consulta.id_medico}/${consulta.id_consulta}`}>
										<RiEdit2Line />
									</Link>
								</td>
							)}
							{user?.role === 'ADMIN' && (
								<td>
									<Link to={`/consultas/apagar/${consulta.id_medico}/${consulta.id_consulta}`}>
										<RiDeleteBin6Line />
									</Link>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
