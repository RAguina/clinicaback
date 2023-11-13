import axios from 'axios';

const apiUrl = 'https://ep-lingering-salad-18930252.us-east-2.aws.neon.fl0.io:8080';

export async function obtenerMedicos() {
    const respuesta = await axios.get(`${apiUrl}/medicos/`)
    return respuesta.data
}   

export async function obtenerMedico(id) {

    console.log(id);
    const respuesta = await axios.get(`${apiUrl}/medicos/${id}`)
    return respuesta.data
}

export async function agregarMedico(datos) {
    try {
        const respuesta = await axios.post(`${apiUrl}/medicos/`, datos)
        
        return respuesta.data
    } catch (error) {
        console.error('Error en agregarMedico:', error);
        throw error;
    }
}
//const respuesta = await axios.post('http://localhost:3000/medicos', datos);

export async function actualizarMedico(id, datos) {
    try {
        const respuesta = await axios.put(`${apiUrl}/medicos/${id}`, datos)
        return respuesta.data
    } catch (error) {
        console.log(error)
    }
}

export async function eliminarMedico(id) {
    try {
        const respuesta = await axios.delete(`${apiUrl}/medicos/{id}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al eliminar el médico:', error);
    }
}

