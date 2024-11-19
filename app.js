import express from 'express';
import cors from 'cors';
import { signUp, login, refreshToken } from './controller/userAuth.js';
import { addProductToHistory, getAllProduct } from './controller/productManagement.js';

const app = express();
const port = 5000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true
}));

app.get('/', () => {
    res.status(200).json({
        success: true,
        message: "Selamat datang di Fits"
    })
});

// User Auth
app.post('/signup', signUp);
app.post('/login', login);
app.post('/refreshtoken', refreshToken);

// History Management
app.post('/products', addProductToHistory);
app.get('/products', getAllProductByUser);
app.get('/product/:id', ); // Menampilkan product berdasarkan id product (martha)

app.get('/allergy', ); // Menampilkan semua allergy (martha)
app.post('/allergy/detect', ); // Mendeteksi allergy



app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        message: "User found",
        data: `Hello user id ${id}`
    })
});

app.listen(port, () => {
    console.log(`App running on ${port}`)
});