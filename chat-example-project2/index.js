
const ssl = false

// AWS KONTO PASSWORT:     Unavejun93947@

if(ssl){
var express = require('express');
var app = express();
var fs = require('fs');
var server = require('https').createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'unavejun93947',
}, app);
var io = require('socket.io')(server);

} else {
	 console.log('http connection:');
	
var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
}

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

server.listen(port, () => console.log('server listening on port ' + port));






var arr = [];
var arr_sockets = [];


// Chatroom

var numUsers = 0;







io.on('connection', (socket) => {
  var addedUser = false;
  console.log('connection:');
  //console.log(socket.username);
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
	  console.log(socket.username);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  
//when the client emits 'new message', this listens and executes
  socket.on('new private message', (data) => {
    // we tell the client to execute 'new message'
	  console.log(data.zu);
	  console.log(data.message);
	  
	  
	  var eee = arr.indexOf(data.zu)
	  console.log('index of pimmel:'+eee);
	  console.log('usename of pimmel:'+arr_sockets[eee].username);
	  console.log('id of pimmel:'+arr_sockets[eee].id);
	  //socket.broadcast.to(arr_sockets[eee].id).emit('new message',{
	//	  username: socket.username,
	  //    message: data.message
    //  });
	  
	  socket.broadcast.to(arr_sockets[eee].id).emit('new message',{
		  username: socket.username,
	      message: data.message
      });
	  
	
    
  });
  
  
  
  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;
    
    
   // console.log(username);
    //arr.push(username);
   // arr_sockets.push()
    //console.log('IN Gespeicherte User');
  //  console.log(arr);
    
    
    ///
    ///
    ///
    /// WICHTIG
    // we store the username in the socket session for this client
    socket.username = username;
    ///
    ///
    ///
    ///
    ///
    arr.push(socket.username)
    arr_sockets.push(socket)
      console.log('IN Gespeicherte Sockets');
    for (var i = 0; i < arr_sockets.length; i++) {
    	  console.log(arr_sockets[i].username);
    	}
    
    
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      //console.log('Disconnected User: ');
      //console.log(socket.username);
      arr.splice(arr.indexOf(socket.username),1);
      arr_sockets.splice(arr_sockets.indexOf(socket),1);
      console.log('OUT Gespeicherte Sockets');
      for (var i = 0; i < arr_sockets.length; i++) {
      	  console.log(arr_sockets[i].username);
      	}
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
