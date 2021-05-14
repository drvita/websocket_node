const WebSocket = require("ws");
const ws = new WebSocket.Server({ port: 8000 });
let msgServer = {};
let clientsHost = [];

ws.on("connection", (socket, req) => {
  const id = req.headers["sec-websocket-key"];
  clientsHost[id] = {
    name: "",
    ip: req.socket.remoteAddress,
  };

  socket.on("message", (msgText) => {
    const msg = JSON.parse(msgText);
    let name = clientsHost[id].name;

    if (name == "") name = id;

    console.log(
      "Mensaje recibido de " + clientsHost[id].ip + " ",
      "[" + msg.canal + "][" + msg.username + "]:",
      msg.msg
    );
    ws.clients.forEach((client) => {
      client.send(JSON.stringify(msg));
    });
  });

  socket.on("close", () => {
    let name = clientsHost[id].name;
    if (name == "") name = id;
    console.log("Nodo desconectado", clientsHost[id].ip);
    delete clientsHost[id];
  });

  console.log("+1 socket conectado: ", clientsHost[id].ip);
});
