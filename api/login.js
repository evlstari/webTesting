const bcrypt = require('bcryptjs'); // Untuk hashing password

// Data pengguna dummy. Dalam aplikasi nyata, ini dari database.
const users = [
    {
        email: 'user@example.com',
        // Password: "password123". Hash ini dibuat dengan bcrypt.hash('password123', 10);
        passwordHash: '$2a$10$oE1E0n2N2T4U5V6W7X8Y9O.h.d.z.w.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5.6.7.8.9'
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