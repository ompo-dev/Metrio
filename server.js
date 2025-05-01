const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const path = require("path");

// Importar o sistema de PubSub
// Comentando temporariamente para diagnóstico
// const { initPubSub } = require(path.join(__dirname, "lib", "pubsub"));

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Inicializa o Socket.IO no servidor HTTP
  const io = new Server(server, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Configura o Socket.IO
  io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    // Autenticar usuário
    const userId = socket.handshake.query.userId;
    if (!userId) {
      console.log("Usuário não autenticado, desconectando...");
      socket.disconnect();
      return;
    }

    // Registrar conexão
    console.log(`Usuário ${userId} conectado (socket: ${socket.id})`);

    // Evento de desconexão
    socket.on("disconnect", () => {
      console.log(`Usuário ${userId} desconectado (socket: ${socket.id})`);
    });
  });

  // Armazenar a referência global para o servidor Socket.IO
  // Isso é importante para que o sistema de socketio.ts possa acessar
  global.socketIOInstance = io;

  // Inicializa o sistema PubSub do PostgreSQL
  // Comentando temporariamente para diagnóstico
  // initPubSub().catch((err) => {
  //   console.error("Erro ao inicializar PubSub:", err);
  // });

  // Inicia o servidor
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Servidor pronto na porta ${PORT}`);
  });
});
