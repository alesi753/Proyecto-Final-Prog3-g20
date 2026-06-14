const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_por_defecto';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Interrupción: Token no proporcionado en el Header' });
  }

  // Extrae el token asumiendo el formato "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Interrupción: Formato de token inválido' });
  }

  try {
    // Decodifica y valida la firma criptográfica
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Inyecta el payload (id, rol) en el objeto request para que lo consuma el controlador
    req.user = decoded;
    
    // Libera el paquete para que continúe hacia el controlador
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Interrupción: Certificado inválido o expirado' });
  }
}

module.exports = { verificarToken };