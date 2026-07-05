const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // on restreindra ça plus tard avec l'URL Vercel du frontend
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Liste des salons disponibles
const SALONS = ["Général", "Tech", "Détente"];

io.on("connection", (socket) => {
  console.log(`✅ Nouvel utilisateur connecté : ${socket.id}`);

  // L'utilisateur rejoint un salon
  socket.on("rejoindre_salon", ({ salon, pseudo }) => {
    if (!SALONS.includes(salon)) return;

    socket.join(salon);
    socket.data.pseudo = pseudo;
    socket.data.salon = salon;

    console.log(`👉 ${pseudo} a rejoint le salon "${salon}"`);

    // On informe les autres membres du salon
    socket.to(salon).emit("message_systeme", {
      texte: `${pseudo} a rejoint le salon.`,
      horodatage: new Date().toISOString(),
    });
  });

  // Réception d'un message et diffusion au salon concerné
  socket.on("envoyer_message", ({ texte }) => {
    const { salon, pseudo } = socket.data;
    if (!salon || !pseudo) return;

    const message = {
      pseudo,
      texte,
      horodatage: new Date().toISOString(),
    };

    console.log(`💬 [${salon}] ${pseudo} : ${texte}`);

    // Envoi à tous les membres du salon, y compris l'expéditeur
    io.to(salon).emit("nouveau_message", message);
  });

  socket.on("disconnect", () => {
    const { salon, pseudo } = socket.data;
    console.log(`❌ Utilisateur déconnecté : ${socket.id}`);

    if (salon && pseudo) {
      socket.to(salon).emit("message_systeme", {
        texte: `${pseudo} a quitté le salon.`,
        horodatage: new Date().toISOString(),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur backend chat-raztech démarré sur le port ${PORT}`);
});