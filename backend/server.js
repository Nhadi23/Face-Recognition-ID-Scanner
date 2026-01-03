const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');
const UserController = require('./controllers/UserController');
const permissionController = require('./controllers/PermissionController');
const AttendanceLogController = require('./controllers/AttendanceLogController');
const GateController = require('./controllers/GateController');

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		credentials: true,
	})
);
app.use(cookieParser());

app.use('/api/user', UserController);
app.use('/api/permission', permissionController);
app.use('/api/attendance', AttendanceLogController);
app.use('/api/gate', GateController);

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/', (req, res) => {
	res.send('Backend Server is running.');
});

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'healthy',
		timestamp: new Date().toISOString()
	});
});

// Run server
const server = app.listen(port, () => {
	console.log(`Server is listening on http://localhost:${port}`);
});

// Catch all errors to prevent crashes
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
	console.error('Unhandled Rejection:', err);
});
