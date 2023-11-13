import axios from 'axios';


export async function obtenerPacientes() {
    const respuesta = await axios.get('http://localhost:3000/pacientes/')
    return respuesta.data
}   

export async function obtenerPaciente(id) {

    console.log(id);
    const respuesta = await axios.get('http://localhost:3000/pacientes/${id}')
    return respuesta.data
}

export async function agregarPaciente(datos) {
    try {
        const respuesta = await axios.post('http://localhost:3000/pacientes/', datos)
        
        return respuesta.data
    } catch (error) {
        console.error('Error en agregarPaciente:', error);
        console.log(error)
        throw error;
    }
}

export async function actualizarPaciente(id, datos) {
    try {
        const respuesta = await axios.put(`{http://localhost:3000/pacientes/}${id}`, datos)
        return respuesta.data
    } catch (error) {
        console.log(error)
    }
}

export async function eliminarPaciente(id) {
    try {
        const respuesta = await axios.delete(`http://localhost:3000/pacientes/${id}`);
        return respuesta.data;
    } catch (error) {
        console.error('Error al eliminar el médico:', error);
    }
}