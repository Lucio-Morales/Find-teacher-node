const supabase = require('../createClient');

const registerTeacher = async (req, res) => {
  const { name, age, email } = req.body;
  try {
    const { data, error } = await supabase
      .from('teachers')
      .insert([{ name, age, email }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Teacher created successfully', data });
  } catch (error) {
    console.error('Error creating teacher:', error.message);
    res
      .status(500)
      .json({ message: 'Error creating teacher', error: error.message });
  }
};

const getAllTeachers = async (req, res) => {
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

const getTeacherById = async (req, res) => {
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

module.exports = { registerTeacher, getAllTeachers, getTeacherById };
