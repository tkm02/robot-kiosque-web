"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, ShieldCheck, UserCircle2 } from "lucide-react"
import { useState } from "react"

interface AuthScreenProps {
  onLogin: (data: { health_center: string; nurse_name: string }) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [formData, setFormData] = useState({
    health_center: "",
    nurse_name: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.health_center || !formData.nurse_name) {
      setError("Veuillez remplir tous les champs pour continuer.")
      return
    }
    onLogin(formData)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-2xl mb-2">
            <ShieldCheck className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Accès Kiosque</h1>
          <p className="text-slate-500 font-medium">Authentification du personnel soignant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Centre de Santé</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: CHR de Man, CSU de Cocody..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-900"
                value={formData.health_center}
                onChange={(e) => setFormData({ ...formData, health_center: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Nom de l'Infirmier(e)</label>
            <div className="relative">
              <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Votre nom complet"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-900"
                value={formData.nurse_name}
                onChange={(e) => setFormData({ ...formData, nurse_name: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-bold text-center animate-shake">{error}</p>
          )}

          <Button 
            type="submit"
            className="w-full py-8 text-xl font-bold bg-teal-600 hover:bg-teal-700 rounded-2xl shadow-lg transition-all group"
          >
            Démarrer la Session
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">PNLP Côte d'Ivoire • Système de Triage IA</p>
        </div>
      </div>
    </div>
  )
}
