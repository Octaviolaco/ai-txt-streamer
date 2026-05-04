"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";


export function LoginForm() {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isRegisterMode){
        setSuccessMsg("Création du compte...")
        await register(username,password)
      } else {
        await login(username,password)
      }
    } catch (err: any) {
      setError("Identifiants incorrects ou problème serveur.");
      setSuccessMsg("")
    } finally {
      setLoading(false);
      console.log("Formulaire soumis avec", { username, password });
    }
  };

  return (<div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-xl shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{isRegisterMode ? "Créer un compte" : "Connexion"}</h2>
          <p className="text-muted-foreground mt-2">Accède à ton assistant</p>
        </div>

        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
        {successMsg && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom d'utilisatrice</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center justify-center transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : (isRegisterMode ? "S'inscrire" : "Se connecter")}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  )
}