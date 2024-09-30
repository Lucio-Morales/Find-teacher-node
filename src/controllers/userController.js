const supabase = require('../createClient');
const bcrypt = require('bcrypt');

// REGISTRA UN NUEVO USUARIO
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Teacher created successfully', data });
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
