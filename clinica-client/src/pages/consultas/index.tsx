import { useEffect } from 'react';
import { useConsultas } from '../../context/ConsultasContext';

export const Consultas = () => {
	const { consultas, getConsultas } = useConsultas();

	useEffect(() => {
		getConsultas();
	}, []);

    console.log(consultas);
    
    //#TODO - Fazer um hook para saber se esta loggedIn

	return (
		<div>
			<h1>consultas</h1>
		</div>
	);
};
