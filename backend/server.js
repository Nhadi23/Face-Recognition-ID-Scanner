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
const db = require('./config/database');

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

// Health check endpoint with database connectivity
app.get('/health', async (req, res) => {
	try {
		// Check database connection
		await db.raw('SELECT 1');
		res.status(200).json({
			status: 'healthy',
			database: 'connected',
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Health check failed:', error);
		res.status(503).json({
			status: 'unhealthy',
			database: 'disconnected',
			error: error.message,
			timestamp: new Date().toISOString()
		});
	}
});

// Run server
const server = app.listen(port, () => {
	console.log(`Server is listening on http://localhost:${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully...');
	server.close(() => {
		console.log('Server closed');
		db.destroy();
	});
});
