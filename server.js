import express from 'express';
import pg from 'pg';
const { Pool } = pg;
const app = express();
//Desde branch 1.05
app.use(express.json());
// Middlewares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})


// Conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { require:true, rejectUnauthorized: false }
});
app.listen(8080, () => {
  console.log('Servidor corriendo en Puerto : 8080');
});
// Función para formatear la fecha
function formatearFecha(fecha) {
  const fechaObj = new Date(fecha);
  const dia = String(fechaObj.getDate()).padStart(2, '0');
  const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
  const ano = fechaObj.getFullYear();
  return `${ano}/${mes}/${dia}`;
}

// Configura rutas, Prueba
app.get('/', (req, res) => {
  res.send('El server esta online!, ruta root');
});

//Metodos GET (pacientes,medicos,turnos)
// Crear una ruta para obtener todos los pacientes
app.get('/pacientes', async (req, res) => {
  try {
    const sql = 'SELECT * FROM pacientes';
    const result = await pool.query(sql);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los pacientes');
  }
});

// Crear una ruta para obtener todos los medicos
app.get('/medicos', async (req, res) => {
  try {
    const sql = 'SELECT * FROM medicos';
    const result = await pool.query(sql);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los medicos');
  }
});

// Crear una ruta para obtener todos los turnos
app.get('/turnos', async (req, res) => {
  try {
    const sql = `
      SELECT t.*, m.nombre as nombre_medico, m.apellido as apellido_medico, p.nombre as nombre_paciente, p.apellido as apellido_paciente
      FROM turnos t
      LEFT JOIN medicos m ON t.id_medico = m.id
      LEFT JOIN pacientes p ON t.id_paciente = p.id
    `;
    const result = await pool.query(sql);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los turnos');
  }
});

//Metodos DELETE (pacientes,medicos,turnos)
// Crear una ruta para eliminar un paciente
app.delete('/pacientes/:id', async (req, res) => {
  const { id } = req.params;
    
    try {
      // Llamar a la función para desactivar la restricción externa
      await axios.post(`${apiUrl}/desactivar-restriccion-externa`);

      // Eliminar el paciente
      await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);

      res.status(200).json({ mensaje: 'Paciente eliminado exitosamente.' });
  } catch (error) {
      console.error('Error al eliminar el paciente:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
  } finally {
      // Reactivar la restricción de clave externa después de eliminar el paciente
      await axios.post(`${apiUrl}/activar-restriccion-externa`);
  }
});

// Crear una ruta para eliminar un medico
app.delete('/medicos/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM medicos WHERE id = ${id}`;
  try {
    const result = await pool.query(sql);
    if (result.affectedRows === 0) {
      res.status(404).send(`No se encontró un medico con id ${id}.`);
    } else {
      res.send(`Medico con id ${id} eliminado.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Hubo un error al eliminar el medico.');
  }
});

// Crear una ruta para eliminar un turno
app.delete('/turnos/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM turnos WHERE id = ${id}`;
  try {
    const result = await pool.query(sql);
    if (result.affectedRows === 0) {
      res.status(404).send(`No se encontró un turno con id ${id}.`);
    } else {
      res.send(`Turno con id ${id} eliminado.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Hubo un error al eliminar el turno.');
  }
});

//Metodos POST (pacientes,medicos,turnos)
//Agregar Paciente
app.post('/pacientes', async (req, res) => {
  const { nombre, apellido, empresa, telefono, notas, obrasocial, fechanacimiento, email } = req.body;
  
  // Generar fechaAlta
  const fechaAlta = formatearFecha(new Date());
  const fechaNacimientoFormateada = formatearFecha(fechanacimiento);

  const sql = 'INSERT INTO pacientes (nombre, apellido, empresa, telefono, notas, obrasocial, fechanacimiento, fechaAlta, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  const values = [nombre, apellido, empresa, telefono, notas, obrasocial, fechaNacimientoFormateada, fechaAlta, email];
  try {
    await pool.query(sql, values);
    res.send('Paciente agregado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Hubo un error al agregar el paciente.');
  }
});


//Agregar Medico
app.post('/medicos', async (req, res) => {
  const { nombre, apellido, especialidad, telefono, notas, obrasocial, fechanacimiento, email } = req.body;
  
  // Generar fechaAlta
  const fechaAlta = formatearFecha(new Date());
  console.log(fechanacimiento);
  const fechaNacimientoFormateada = formatearFecha(fechanacimiento);
  console.log(fechaNacimientoFormateada);
  const sql = 'INSERT INTO medicos (nombre, apellido, especialidad, telefono, notas, obrasocial, fechanacimiento, email, fechaalta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  const values = [nombre, apellido, especialidad, telefono, notas, obrasocial, fechaNacimientoFormateada, email, fechaAlta];
  
  try {
    await pool.query(sql, values);
    res.send('Medico agregado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Hubo un error al agregar el médico.');
  }
});

//Agregar Turno
app.post('/turnos', async (req, res) => {
  const { fecha_turno, hora_turno, id_paciente, id_medico, estado, notas } = req.body;
  
  const sql = 'INSERT INTO turnos (fecha_turno, hora_turno, id_paciente, id_medico, estado, notas) VALUES ($1, $2, $3, $4, $5, $6)';
  const values = [fecha_turno, hora_turno, id_paciente, id_medico, estado, notas];
  
  try {
    await pool.query(sql, values);
    res.send('Turno agregado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Hubo un error al agregar el turno.');
  }
});


//Metodos PUT (pacientes,medicos,turnos)
// Actualizar Paciente
app.put('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, empresa, telefono, notas, obrasocial, fechanacimiento, email } = req.body;
  const fechaNacimientoFormateada = formatearFecha(fechanacimiento)

  let sql = `UPDATE pacientes SET nombre = $1, apellido = $2, empresa = $3, telefono = $4, notas = $5, obrasocial = $6, fechanacimiento = $7, email = $8 WHERE id = $9`;
  let values = [nombre, apellido, empresa, telefono, notas, obrasocial, fechaNacimientoFormateada, email, id];
  
  pool.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send(`Paciente con id ${id} actualizado.`);
  });
});

// Actualizar Medico
app.put('/medicos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, especialidad, telefono, notas, obrasocial, fechanacimiento, email } = req.body;
  const fechaNacimientoFormateada = formatearFecha(fechanacimiento)
  let sql = `UPDATE medicos SET nombre = $1, apellido = $2, especialidad = $3, telefono = $4, notas = $5, obrasocial = $6, fechanacimiento = $7, email = $8 WHERE id = $9`;
  let values = [nombre, apellido, especialidad, telefono, notas, obrasocial, fechaNacimientoFormateada, email, id];
  
  pool.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send(`Medico con id ${id} actualizado.`);
  });
});

// Actualizar Turno
app.put('/turnos/:id', (req, res) => {
  const { id } = req.params;
  const { fecha_turno, hora_turno, id_paciente, id_medico, estado, notas } = req.body;
  const fechaTurnoactualizada = formatearFecha(fecha_turno);

  let sql = `UPDATE turnos SET fecha_turno = $1, hora_turno = $2, id_paciente = $3, id_medico = $4, estado = $5, notas = $6 WHERE id = $7`;
  let values = [fechaTurnoactualizada, hora_turno, id_paciente, id_medico, estado, notas, id];

  pool.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send(`Turno con id ${id} actualizado.`);
  });
});


  //Desactivar restricciones externes
//Pacientes
// Descripción: Desactiva temporalmente la restricción de clave externa
app.post('/desactivar-restriccion-externa', async (req, res) => {
  try {
      // Desactivar la restricción de clave externa en la columna 'id_paciente' de la tabla 'turnos'
      await pool.query('ALTER TABLE turnos DROP CONSTRAINT id_paciente;');
      res.status(200).json({ mensaje: 'Restricción externa desactivada exitosamente.' });
  } catch (error) {
      console.error('Error al desactivar restricción externa:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Descripción: Reactiva la restricción de clave externa
app.post('/activar-restriccion-externa', async (req, res) => {
  try {
      // Reactivar la restricción de clave externa en la columna 'id_paciente' de la tabla 'turnos'
      await pool.query('ALTER TABLE turnos ADD CONSTRAINT fk_turnos_pacientes FOREIGN KEY (id_paciente) REFERENCES pacientes(id);');
      res.status(200).json({ mensaje: 'Restricción externa activada exitosamente.' });
  } catch (error) {
      console.error('Error al activar restricción externa:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
  }
});