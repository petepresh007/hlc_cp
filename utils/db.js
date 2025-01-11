const mongoose = require('mongoose');
const db = 'cooperative';
const url = `${process.env.MONGO_URI}/${db}`;

module.exports = {
    connectDB: async () => {
        try {
            const conn = await mongoose.connect(url, {
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
            });
            console.log('Database connected successfully');
            return conn;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    },

    // Method to close the database connection
    closeDB: async () => {
        try {
            await mongoose.connection.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing the database connection:', error);
        }
    },
};