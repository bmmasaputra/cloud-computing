import express from 'express';
import cors from 'cors';
import { signUp, login, refreshToken } from './controller/userAuth.js';
import { addProductToHistory, getAllProduct, getProductById } from './controller/productManagement.js';
import { getAllAllergy, setUserAllergy, detectAllergy } from './controller/allergy.js';
import getUserData from './controller/userData.js';

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
        message: "Welcome to FITS! Your personal food advisor"
    })
});

// Public
app.post('/api/v1/users', signUp);
app.post('/api/v1/users/login', login);
app.get('/api/v1/users/:id', getUserData);

// User Auth
app.post('/api/v1/refreshtoken', refreshToken);

app.post('/api/v1/products', addProductToHistory);
app.get('/api/v1/products', getAllProduct);
app.get('/api/v1/products/:id', getProductById); // Menampilkan product berdasarkan id product (martha)

app.get('/api/v1/allergy', getAllAllergy); // Menampilkan semua allergy (martha)
app.post('/api/v1/users/allergy', setUserAllergy);
app.post('/api/v1/products/allergy', detectAllergy); // Mendeteksi allergy

app.get('/api/v1/article')
app.get('/api/v1/article/:id')

app.listen(port, () => {
    console.log(`App running on port ${port}`)
});