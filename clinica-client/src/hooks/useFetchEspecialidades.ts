import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { medicoEspecialidades } from "../models/medico-especialidades";

export const useFetchEspecialidades = () => {
    const [data, setData] = useState<medicoEspecialidades[]>([]);
    const [idMedico, setIdMedico] = useState('');
    const [idEspecialidade, setIdEspecialidade] = useState('');

	useEffect(() => {
        async function fetchEspecialidades() {
            try {
                const response = await api.get(`/medicos-especialidades/${idMedico}`);
                setData(response.data);
    
                if (response.data.length === 0) {
                    setIdEspecialidade('');
                }
            } catch(err){
                console.error(err)
            }
		}
		fetchEspecialidades();
		setData([]);
    }, [idMedico]);
    
    return {data, idMedico, setIdMedico, idEspecialidade, setIdEspecialidade};
};