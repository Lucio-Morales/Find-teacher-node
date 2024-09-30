const supabase = require('../createClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    // ** MENSAJE PARA MI YO DEL FUTURO: ESTE LOGIN NO ES GENERICO PORQUE TENGO TABLAS STUDENTS Y TEACHERS POR SEPARADO. ARREGLARLO **
    const { data: user, error } = await supabase
      .from('students')
      .select('id, email, password, role')
      .eq('email', email)
      .single();

    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generar un JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET, // Clave secreta, debe estar definida en las variables de entorno
      { expiresIn: '1h' } // Tiempo de expiración del token
    );

    // Devolver el token al cliente
    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

module.exports = { loginUser };
