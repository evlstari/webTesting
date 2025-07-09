const bcrypt = require('bcryptjs'); // Untuk hashing password

const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    console.log('Generated hash for "password123":', hash);
});


// Data pengguna dummy. Dalam aplikasi nyata, ini dari database.

const users = [

    {

        email: 'user@example.com',

        // Password: "password123". Hash ini dibuat dengan bcrypt.hash('password123', 10);

        passwordHash: '$2b$10$WzUlb9m7utHar.bnwCPGReWa9wFtKsGqqzTPsyz2i7.KUgbKox4L.'

    }

];
// Fungsi utama untuk Serverless Function
module.exports = async (req, res) => {
    // Pastikan request adalah POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Ambil email dan password dari body request
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Cari pengguna berdasarkan email
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Bandingkan password yang diberikan dengan hash password yang tersimpan
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Jika berhasil, kirim respons sukses
    res.status(200).json({
        message: 'Login successful!',
        user: { email: user.email } // Kirim data user yang relevan
    });
};