import React from 'react';
import { 
  CheckSquare, 
  ListTodo, 
  Calendar, 
  PieChart, 
  Settings, 
  LogOut, 
  User 
} from 'lucide-react';

export default function Navbar() {
  return (
    <aside className="w-20 h-screen bg-slate-900 flex flex-col justify-between items-center py-6 text-slate-400 border-r border-slate-800">
      
      {/* 1. HAUT : Le Logo */}
      <div className="flex items-center justify-center text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer">
        <CheckSquare size={32} strokeWidth={2.5} />
      </div>

      {/* 2. MILIEU : Les Icônes Nécessaires (Navigation) */}
      <nav className="flex flex-col gap-6 flex-1 justify-center w-full px-2">
        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group relative">
          <ListTodo size={24} />
          <span className="text-[10px] mt-1 font-medium">Tâches</span>
        </button>

        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group">
          <Calendar size={24} />
          <span className="text-[10px] mt-1 font-medium">Agenda</span>
        </button>

        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group">
          <PieChart size={24} />
          <span className="text-[10px] mt-1 font-medium">Stats</span>
        </button>

        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group">
          <Settings size={24} />
          <span className="text-[10px] mt-1 font-medium">Settings</span>
        </button>
      </nav>

      {/* 3. BAS : Profil Utilisateur & Logout */}
      <div className="flex flex-col items-center gap-4 w-full px-2 border-t border-slate-800 pt-4">
        {/* Icône User / Profil */}
        <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:ring-2 hover:ring-indigo-500 transition-all">
          <User size={20} />
        </button>
      </div>

    </aside>
  );
}