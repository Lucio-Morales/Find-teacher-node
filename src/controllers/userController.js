const supabase = require('../createClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRA UN NUEVO USUARIO
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role }])
      .select();

    if (userError) throw userError;

    user = userData[0];

    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .insert([{ user_id: user.id }]);

    if (profileError) throw profileError;

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res
      .status(500)
      .json({ message: `Error creating ${role}`, error: error.message });
  }
};

// OBTIENE TODOS LOS TEACHERS
const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from('teachers').select('*');
    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener los profesores:', error.message);
    res.status(500).json({
      message: 'Error al obtener los profesores',
      error: error.message,
    });
  }
};

// OBTIENE UN TEACHER POR SU ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error al obtener el profesor con ID ${id}:`, error.message);
    res.status(500).json({
      message: `Error al obtener el profesor con ID ${id}`,
      error: error.message,
    });
  }
};

module.exports = { registerUser, getAllUsers, getUserById };
