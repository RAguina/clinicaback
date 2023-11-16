import express from 'express';
import cors from 'cors';
import pkg from 'pg';
//import dotenv from 'dotenv';
//dotenv.config({path:'./.env'});
const { Pool } = pkg;
const app = express();

// Define la constante con la URL del backend
const dbURL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;
const dbUrl2 = 'postgres://fl0user:3Hm0OMDcwCQU@ep-yellow-sun-67051456.us-east-2.aws.neon.fl0.io:5432/dbClinica?sslmode=require' 
app.use(express.static('assets'));
// Middlewares
/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://raguina.github.io/clinicaAP/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})
*/

app.use((req, res, next) => {
  const allowedOrigins = ['https://raguina.github.io/', 'https://raguina.github.io', 'https://raguina.github.io/clinicaAP'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

// Middleware para registrar información sobre solicitudes entrantes
/*app.use((req, res, next) => {
  console.log('Solicitud entrante:', req.method, req.url);
  next();
});
*/
/*
app.use(cors({
  origin: ['https://raguina.github.io/clinicaAP'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
*/
/*
app.use(cors({
  origin: ['https://raguina.github.io/', 'http://localhost:5173'],
  credentials: true
}));
*/
app.use(express.json());


// Conexión a la base de datos

const port = process.env.PORT;
//dbURL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
/*const pool = new Pool({
  connectionString: dbURL
});
*/

// Función para formatear la fecha
function formatearFecha(fecha) {
  const fechaObj = new Date(fecha);
  const dia = String(fechaObj.getDate()).padStart(2, '0');
  const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
  const ano = fechaObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Configura rutas, Prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
  res.send(`Este es el puerto ${DB_PORT}`)
  res.send(`Este no es el puerto ${process.env.DB_PORT}`)
  res.send('Adios mundo cruel')
  res.send(`${dbUrl2}`)
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
  const sql = `DELETE FROM pacientes WHERE id = ${id}`;
  try {
    const result = await pool.query(sql);
    if (result.affectedRows === 0) {
      res.status(404).send(`No se encontró un paciente con id ${id}.`);
    } else {
      res.send(`Paciente con id ${id} eliminado.`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Hubo un error al eliminar el paciente.');
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
  
  let sql = `UPDATE pacientes SET nombre = $1, apellido = $2, empresa = $3, telefono = $4, notas = $5, obrasocial = $6, fechanacimiento = $7, email = $8 WHERE id = $9`;
  let values = [nombre, apellido, empresa, telefono, notas, obrasocial, fechanacimiento, email, id];
  
  pool.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send(`Paciente con id ${id} actualizado.`);
  });
});

// Actualizar Medico
app.put('/medicos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, especialidad, telefono, notas, obrasocial, fechanacimiento, email } = req.body;
  
  let sql = `UPDATE medicos SET nombre = $1, apellido = $2, especialidad = $3, telefono = $4, notas = $5, obrasocial = $6, fechanacimiento = $7, email = $8 WHERE id = $9`;
  let values = [nombre, apellido, especialidad, telefono, notas, obrasocial, fechanacimiento, email, id];
  
  pool.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send(`Medico con id ${id} actualizado.`);
  });
});

// Actualizar Turno
app.put('/turnos/:id', (req, res) => {
  const { id } = req.params;
  const { fecha_turno, hora_turno, id_paciente, id_medico, estado, notas } = req.body;
  
  let sql = `UPDATE turnos SET fecha_turno = $1, hora_turno = $2, id_paciente = $3, id_medico = $4, estado = $5, notas = $6 WHERE id = $7`;
  let values = [fecha_turno, hora_turno, id_paciente, id_medico, estado, notas, id];

  pool.query(sql, values, (err, result) => {
    if (err) throw err;
    res.send(`Turno con id ${id} actualizado.`);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en Puerto : ${port}`);
});
