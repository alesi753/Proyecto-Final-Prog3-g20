const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_por_defecto';

function generarToken(user) {

  // Usamos el payload { id: user.id, correo: user.correo } para coincidir con el DER.
  return jwt.sign({ id: user.id, correo: user.correo }, JWT_SECRET, { expiresIn: '24h' });
}

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  
  // El formato es "Bearer <token>". Dividimos por el espacio y tomamos la posición [1].
  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Si es válido, guardamos los datos del usuario en req.user y llamamos a next()
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { generarToken, verificarToken };