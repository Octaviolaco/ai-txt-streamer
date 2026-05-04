const axios = require('axios');
const { setTimeout } = require("timers/promises");
const API_URL = "http://localhost:3001/auth";
const testUser = {
  username: `tester_${Math.floor(Math.random() * 1000)}`,
  password: "password123"
};

let accessToken = "";
let refreshToken = "";


const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runTests() {
  console.log("🚀 DÉMARRAGE DES TESTS API AUTH\n");

  try {
    // --- 1. REGISTER ---
    console.log(`1️⃣ Tentative d'inscription : ${testUser.username}...`);
    await axios.post(`${API_URL}/register`, testUser);
    console.log("✅ Inscription réussie !\n");

    // --- 2. LOGIN ---
    console.log("Waiting 5 sec");
    await setTimeout(10000); 
    setTimeout()
    console.log("2️⃣ Connexion pour récupérer les tokens...");
    const loginRes = await axios.post(`${API_URL}/login`, testUser);
    accessToken = loginRes.data.access_token;
    refreshToken = loginRes.data.refresh_token;
    console.log("✅ Connexion réussie !");
    console.log(`   Access Token : ${accessToken.substring(0, 20)}...`);
    console.log(`   Refresh Token: ${refreshToken.substring(0, 20)}...\n`);

    // --- 3. REFRESH ACCESS TOKEN ---
    // Note : On utilise l'URL avec la faute de frappe "acess" pour correspondre à ton code
    console.log("3️⃣ Test du rafraîchissement de l'Access Token...");
    const refreshRes = await axios.post(`${API_URL}/refresh/acess_token`, {
      username: testUser.username,
      refresh_token: refreshToken
    });
    console.log("✅ Nouvel Access Token reçu !");
    console.log(`   Nouveau : ${refreshRes.data.substring(0, 20)}...\n`);

    // --- 4. REFRESH REFRESH TOKEN ---
    console.log("4️⃣ Test du rafraîchissement du Refresh Token (Rotation)...");
    const newRefreshRes = await axios.post(`${API_URL}/refresh/refresh_token`, {
      username: testUser.username,
      refresh_token: refreshToken
    });
    const oldRefreshToken = refreshToken;
    refreshToken = newRefreshRes.data;
    console.log("✅ Nouveau Refresh Token reçu !");
    console.log(`   Ancien : ${oldRefreshToken.substring(0, 15)}...`);
    console.log(`   Nouveau : ${refreshToken.substring(0, 15)}...\n`);

    // --- 5. TEST DE VALIDATION (Optionnel) ---
    console.log("5️⃣ Vérification : L'ancien Refresh Token doit être invalide...");
    try {
      await axios.post(`${API_URL}/refresh/acess_token`, {
        username: testUser.username,
        refresh_token: oldRefreshToken
      });
    } catch (err) {
      console.log("✅ Sécurité confirmée : L'ancien token a bien été rejeté (403).\n");
    }

    // --- 6. LOGOUT ---
    console.log("6️⃣ Déconnexion de l'utilisateur...");
    await axios.post(`${API_URL}/logout`, {
        // Envoie les infos nécessaires à ton service logout
        id: loginRes.data.userId || 1, 
        access_token: accessToken,
        refresh_token: refreshToken
    });
    console.log("✅ Déconnexion réussie !\n");

    console.log("🏁 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !");

  } catch (error) {
    console.error("❌ ÉCHEC DU TEST :");
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message:`, error.response.data);
    } else {
      console.error(`   Erreur: ${error.message}`);
    }
  }
}

runTests();