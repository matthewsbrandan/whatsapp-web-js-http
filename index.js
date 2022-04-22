require('dotenv/config');

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const origins = process.env.ORIGINS.split(', ');
const io = require('socket.io')(server,{
  cors: {
    origin: origins,
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: origins }));
console.log('Available origins >> ', origins)

app.use(express.static(path.join(__dirname, 'src/public')));
app.set('views', path.join(__dirname, 'src/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json());

console.log('running...');
const classWhatsappController = require('./src/controllers/WhatsappController');
new classWhatsappController(app, io);

app.use('/status-server', (req, res) => {
  res.render('index.html');
});

server.listen(process.env.PORT || 8080);