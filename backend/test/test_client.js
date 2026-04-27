const { io } = require("socket.io-client");
const readline = require("readline");
const axios = require("axios");

async function run() {
  try {
    // 1. Authentification pour récupérer le token
    console.log("🔑 Authentification en cours...");
    const response = await axios.post("http://localhost:3000/auth/login", {
      username: "john", // Remplace par tes identifiants
      password: "changeme"
    });

    const token = response.data.access_token; // Assure-toi que c'est bien ce champ
    console.log("✅ Token reçu !");

    // 2. Connexion WebSocket avec le token récupéré
    const socket = io("http://localhost:3000/chat", {
      extraHeaders: {
        authorization: `Bearer ${token}`
      }
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'Moi > '
    });

    socket.on("connect", () => {
      console.log("✅ Connecté au chat sécurisé !");
      rl.prompt();
    });

    rl.on('line', (line) => {
      if (line.trim() !== '') {
        socket.emit("NewMessage", { text: line });
      }
      rl.prompt();
    });

    socket.on("connect_error", (err) => {
      console.error("\n❌ Erreur de connexion :", err.message);
    });

  } catch (error) {
    console.error("❌ Erreur d'authentification :", error.response?.data || error.message);
  }
}

run();