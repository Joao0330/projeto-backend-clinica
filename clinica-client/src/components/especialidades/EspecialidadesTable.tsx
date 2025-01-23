import { Link } from "react-router-dom";
import { useFetchEspecialidades } from "../../hooks/useFetchEspecialidades";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";

export const EspecialidadesTable = () => {
    const { data: especialidades } = useFetchEspecialidades();

  return (
		<table className='table'>
			<thead>
				<tr>
					<th>Designação</th>
				</tr>
			</thead>

			<tbody>
				{especialidades.map(especialidade => (
					<tr key={especialidade.id}>
						<td>{especialidade.designacao}</td>
						<td>
							<Link to={`/especialidades/editar/${especialidade.id}`}>
								<RiEdit2Line />
							</Link>
						</td>

						<td>
							<Link to={`/especialidades/apagar/${especialidade.id}`}>
								<RiDeleteBin6Line />
							</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
