import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';

import { mountAuth } from './routes/auth';
import { mountRoutes } from './routes';

// Initialize express server
const app = express();
// Add express plugins
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add our custom routes
mountAuth(app);
mountRoutes(app);

app.listen(process.env.PORT || 3000);