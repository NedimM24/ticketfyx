import express from 'express';
import router from './routes/indexRouter';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));