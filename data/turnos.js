import axios from 'axios';

export async function obtenerTurnos() {
    try{
    const respuesta = await axios.get('http://localhost:3000/turnos/')
    return respuesta.data
    } catch (error) {
        console.error('Error en obtenerTurnos:', error);
        throw error;    
    }
}

export async function obtenerTurno(id) {
    try{
    const respuesta = await axios.get(`{http://localhost:3000/turnos/}${id}`)
    return respuesta.data
    } catch (error) {
        console.error('Error en obtenerTurno:', error);
        throw error;
    }
}

export async function agregarTurno(datos) {
    try {
        const respuesta = await axios.post('http://localhost:3000/turnos/', datos)
        return respuesta.data
    } catch (error) {
        console.error('Error en agregarTurno:', error);
        throw error;
    }
}

export async function actualizarTurno(id, datos) {
    try {
        const respuesta = await axios.put(`http://localhost:3000/turnos/${id}`, datos);
        return respuesta.data
    } catch (error) {
        console.error('Error en actualizarTurno:', error);
        throw error;
    }
}

export async function actualizarEstadoTurno(id, estado) {
    try {
        const respuesta = await axios.put(`{http://localhost:3000/turnos/}${id}`, { estado })
        return respuesta.data
    } catch (error) {
        console.error('Error en actualizarEstadoTurno:', error);
        throw error;
    }
}

export async function eliminarTurno(id) {
    try {
        const respuesta = await axios.delete(`{http://localhost:3000/turnos/}${id}`)
        return respuesta.data
    } catch (error) {
        console.error('Error en eliminarTurno:', error);
        throw error;
    }
}
