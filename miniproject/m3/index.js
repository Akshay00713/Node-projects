const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path'); // For resolving file paths

// (Optional) Connect to your data source (e.g., database, API)
// ...

io.on('connection', (socket) => {
  console.log('A user connected!');

  // Handle data updates from the data source
  const intervalId = setInterval(async () => {
    const newData = await fetchDataFromSource(); // Replace with your logic
    socket.emit('data-update', newData); // Broadcast data to all clients
  }, 1000); // Update every second (adjust as needed)

  socket.on('disconnect', () => {
    clearInterval(intervalId); // Stop sending updates when client disconnects
  });
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., JavaScript for charting)
app.use(express.static(path.join(__dirname, 'public')));

// Main dashboard route
app.get('/', (req, res) => {
  res.render('index'); // Render the dashboard.ejs template
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});