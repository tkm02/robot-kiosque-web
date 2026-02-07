"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, ChevronLeft, Map as MapIcon, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface AnalyticsDashboardProps {
  onBack: () => void
}

export default function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch("http://localhost:8000/analytics/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats Error:", err))
  }, [])

  const trendData = [
    { name: 'Lun', cases: 12, severe: 2 },
    { name: 'Mar', cases: 19, severe: 4 },
    { name: 'Mer', cases: 15, severe: 3 },
    { name: 'Jeu', cases: 22, severe: 8 },
    { name: 'Ven', cases: 30, severe: 12 },
    { name: 'Sam', cases: 25, severe: 5 },
    { name: 'Dim', cases: 18, severe: 3 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord Sanitaire</h1>
              <p className="text-slate-500">Données en temps réel (Silver Layer)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total Consultations</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.total_consultations || "..."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Trend Chart */}
          <div className="md:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-bold text-slate-800">Tendances Hebdomadaires</h2>
              </div>
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Line type="monotone" dataKey="cases" stroke="#0d9488" strokeWidth={3} dot={{r: 4, fill: '#0d9488'}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="severe" stroke="#e11d48" strokeWidth={3} dot={{r: 4, fill: '#e11d48'}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Heatmap / District List */}
          <div className="md:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <MapIcon className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-800">Cas par District</h2>
            </div>
            <div className="space-y-4">
              {stats?.heatmap?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.district}</span>
                    <span className="font-bold text-teal-600">{item.cases} cas</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${(item.cases / 150) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <div className="flex items-center gap-3 text-amber-800 font-bold mb-2">
                 <BarChart3 className="w-5 h-5" />
                 Alerte de Vigilance
               </div>
               <p className="text-sm text-amber-700">
                 Augmentation de 15% des cas graves dans le district d'Abidjan par rapport à la semaine dernière.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
