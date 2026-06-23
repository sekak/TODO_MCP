import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
// import { useAuthStore } from './store/authStore';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const useAuthStore = ()=>{
    return {
      checkAuth: async () => {
        // Implémentez ici la logique pour vérifier l'authentification de l'utilisateur
        // Par exemple, vous pouvez appeler une API pour vérifier le token et mettre à jour l'état global
      }
    };  
  }// Importation correcte de useAuthStore
  const { checkAuth } = useAuthStore();

  // États de la vérification : 'loading', 'success', ou 'error'
  const [status, setStatus] = useState('loading'); 
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Récupérer le token dans l'URL (ex: /verify-email?token=xyz123)
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage("Le lien de vérification est invalide ou manquant.");
      return;
    }

    // 2. Envoyer le token au Back-end pour validation
    axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        setStatus('success');
        // Mettre à jour Zustand pour passer l'utilisateur en "vérifié"
        await checkAuth(); 
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || "Le lien a expiré ou est invalide.");
      });
  }, [token, checkAuth]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Effets lumineux */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
        
        {/* ÉTATS 1 : Chargement / Vérification en cours */}
        {status === 'loading' && (
          <div className="py-6 space-y-4">
            <Loader2 size={40} className="animate-spin text-indigo-400 mx-auto" />
            <h1 className="text-xl font-bold text-white">Vérification en cours...</h1>
            <p className="text-sm text-slate-400">Nous validons votre adresse email auprès de nos serveurs.</p>
          </div>
        )}

        {/* ÉTAT 2 : Succès de la validation */}
        {status === 'success' && (
          <div className="py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Email vérifié !</h1>
              <p className="text-sm text-slate-400">Votre compte TODO est maintenant entièrement activé.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              Accéder à mes tâches
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ÉTAT 3 : Erreur (Lien expiré ou modifié) */}
        {status === 'error' && (
          <div className="py-6 space-y-5">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
              <XCircle size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Échec de la vérification</h1>
              <p className="text-sm text-rose-400/80">{errorMessage}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-2xl transition-colors"
            >
              Retour à la page de connexion
            </button>
          </div>
        )}

      </div>
    </div>
  );
}