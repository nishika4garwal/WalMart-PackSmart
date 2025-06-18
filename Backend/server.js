const http = require('http');
const app = require('./app'); // Import the Express app
const dotenv = require('dotenv'); // Import dotenv to load environment variables
const port = process.env.PORT || 3000; // Set the port from environment variables or default to 3000


const server = http.createServer(app); // Create an HTTP server using the Express app
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`); 
}); // Start the server on port 3000
