import { Link } from 'react-router-dom';
import { useFetchMedicos } from '../../hooks/useFetchMedicos';
import { RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';

export const MedicosTable = () => {
    const { data: medicos } = useFetchMedicos();

	const sortedMedicos = medicos.sort((a, b) => a.numero_empregado - b.numero_empregado);

	return (
		<table className='table'>
			<thead>
				<tr>
					<th>Número de Empregado</th>
					<th>Nome</th>
					<th>Contacto</th>
					<th>Morada</th>
					<th>Editar</th>
					<th>Apagar</th>
				</tr>
			</thead>

			<tbody>
				{sortedMedicos.map(medico => (
					<tr key={medico.id}>
						<td>{medico.numero_empregado}</td>
						<td>{medico.nome}</td>
						<td>{medico.contacto ?? "Sem contacto"}</td>
						<td>{medico.morada ?? "Sem morada"}</td>
						<td>
							<Link to={`/medicos/editar/${medico.id}`}>
								<RiEdit2Line />
							</Link>
						</td>

						<td>
							<Link to={`/medicos/apagar/${medico.id}`}>
								<RiDeleteBin6Line />
							</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
