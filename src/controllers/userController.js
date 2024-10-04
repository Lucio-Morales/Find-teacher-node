const supabase = require('../createClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRA UN NUEVO USUARIO Y CREA SU PERFIL EN FUNCION DEL ROL
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role }])
      .select();

    if (userError) throw userError;

    const user = userData[0];

    let profileData, profileError;

    if (role === 'estudiante') {
      profileData = {
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      ({ data: profileData, error: profileError } = await supabase
        .from('student_profile')
        .insert([profileData]));
    } else if (role === 'profesor') {
      profileData = {
        user_id: user.id,
        created_at: new Date().toISOString,
        updated_at: new Date().toISOString,
      };
      ({ data: profileData, error: profileError } = await supabase
        .from('teacher_profile')
        .insert([profileData]));
    }
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
