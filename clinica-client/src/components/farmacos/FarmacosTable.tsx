import { Link } from 'react-router-dom';
import { useFetchFarmacos } from '../../hooks/useFetchFarmacos';
import { RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

export const FarmacosTable = () => {
	const { data: farmacos } = useFetchFarmacos();
	const { user } = useAuth();

	return (
		<div className='table-container'>
			<table className='table'>
				<thead>
					<tr>
						<th>Nome</th>
						{user?.role === 'ADMIN' && (
							<>
								<th>Editar</th>
								<th>Apagar</th>
							</>
						)}
					</tr>
				</thead>

				<tbody>
					{farmacos.map(farmaco => (
						<tr key={farmaco.id}>
							<td>{farmaco.nome}</td>

							{user?.role === 'ADMIN' && (
								<>
									<td>
										<Link to={`/farmacos/editar/${farmaco.id}`}>
											<RiEdit2Line />
										</Link>
									</td>

									<td>
										<Link to={`/farmacos/apagar/${farmaco.id}`}>
											<RiDeleteBin6Line />
										</Link>
									</td>
								</>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
