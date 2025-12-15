// showData.js
const { sequelize, user, role } = require('./models'); // sesuaikan path

async function showTableData() {
  try {
    const users = await user.findAll({
      include: [{ model: role, as: 'role' }],
      raw: false,
    });

    console.log("\n===== Tabel User =====");
    const tableData = users.map(u => ({
      id_user: u.id_user,
      nama: u.nama,
      email: u.email,
      password: u.password,       // tampilkan password
      role: u.role ? u.role.role : null,
    }));
    console.table(tableData);

    await sequelize.close();
  } catch (err) {
    console.error(err);
  }
}

showTableData();
