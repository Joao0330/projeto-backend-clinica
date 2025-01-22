import { Link } from "react-router-dom";
import { useFetchPacientes } from "../../hooks/useFetchPacientes";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";

export const PacientesTable = () => {
    const { data: pacientes } = useFetchPacientes();
   

  return (
		<table className='table'>
			<thead>
				<tr>
					<th>Nome</th>
					<th>Contacto</th>
					<th>Morada</th>
					<th>Editar</th>
					<th>Apagar</th>
				</tr>
			</thead>

			<tbody>
				{pacientes.map(paciente => (
					<tr key={paciente.id}>
						<td>{paciente.nome}</td>
						<td>{paciente.contacto ?? 'Sem contacto'}</td>
						<td>{paciente.morada ?? 'Sem morada'}</td>
						<td>
							<Link to={`/pacientes/editar/${paciente.id}`}>
								<RiEdit2Line />
							</Link>
						</td>

						<td>
							<Link to={`/pacientes/apagar/${paciente.id}`}>
								<RiDeleteBin6Line />
							</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}