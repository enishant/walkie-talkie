var app = require("express")();
var http = require("http").Server(app);
var ffmpeg = require("ffmpeg");
console.log(ffmpeg)
var io = require("socket.io")(http);

var Usercounter = 0;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  Usercounter = Usercounter + 1;
  io.emit("user", Usercounter);
  console.log("a user is connected");
  
  socket.on("disconnect", function() {
    Usercounter = Usercounter - 1;
    io.emit("user", Usercounter);
    console.log("user disconnected");
  });

  socket.on("audioMessage", function(msg) {
    socket.broadcast.emit("audioMessage", msg);
  });

  socket.on("audioUrl", function(msg) {
    try{
      console.log('audioUrl',msg)
      var processAudio = new ffmpeg(msg);
      // console.log('processAudio',processAudio)
     /* processAudio.then(function(audio){
        console.log('HERE')
      });*/

    } catch(e) {
      console.log(e.code);
      console.log(e.message);
    }
  });

  socket.on("username", function(msg) {
    socket.broadcast.emit("username", msg);
  });
});

http.listen(3000, function() {
  console.log("listening to port:3000");
});
