"use client"

import { Button } from "@/components/ui/button"
import type { QuestionnaireData, ResultData } from "@/lib/types"
import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import {
    Activity,
    Download, Droplets, FileText, Loader2,
    MapPin,
    RefreshCcw, ShieldAlert,
    Thermometer, User
} from "lucide-react"
import { useRef, useState } from "react"

interface ResultScreenProps {
  data: ResultData
  questionnaire: QuestionnaireData
  onNewTest: () => void
}

export default function ResultScreen({ data, questionnaire, onNewTest }: ResultScreenProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const consultationId = Math.random().toString(36).substring(2, 8).toUpperCase()

  // Filter symptoms to show only active ones
  const symptoms = [
    { label: "Fièvre", value: questionnaire.fievre },
    { label: "Céphalées", value: questionnaire.cephalees },
    { label: "Convulsions", value: questionnaire.convulsions },
    { label: "Vomissements", value: questionnaire.nausees_vomissements },
    { label: "Fatigue", value: questionnaire.fatigue },
    { label: "Frissons", value: questionnaire.frissons },
    { label: "Douleurs Art.", value: questionnaire.douleurs_articulaires },
    { label: "Diarrhée", value: questionnaire.diarhee },
  ].filter(s => s.value)

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return
    setIsGenerating(true)
    
    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        pixelRatio: 2
      })
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [reportRef.current.offsetWidth * 2, reportRef.current.offsetHeight * 2]
      })
      
      pdf.addImage(dataUrl, "PNG", 0, 0, reportRef.current.offsetWidth * 2, reportRef.current.offsetHeight * 2)
      pdf.save(`RAPPORT-PALUDISME-${consultationId}.pdf`)
    } catch (error) {
      console.error("PDF Generation Error:", error)
      alert("Erreur lors de la génération du PDF. L'impression classique reste disponible.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Determine official theme colors based on risk
  const getTheme = () => {
    const risk = (data.riskLevel || "").toLowerCase()
    
    if (risk.includes("faible")) 
      return { 
        bg: "bg-emerald-600", 
        hex: "#059669",
        lightBg: "bg-emerald-50",
        text: "text-emerald-700", 
        border: "border-emerald-200", 
        icon: "text-emerald-600",
        fullBg: "bg-emerald-600"
      }
    if (risk.includes("modéré")) 
      return { 
        bg: "bg-amber-500", 
        hex: "#f59e0b",
        lightBg: "bg-amber-50",
        text: "text-amber-700", 
        border: "border-amber-200", 
        icon: "text-amber-600",
        fullBg: "bg-amber-500"
      }
    return { 
      bg: "bg-red-600", 
      hex: "#dc2626",
      lightBg: "bg-red-50",
      text: "text-red-700", 
      border: "border-red-200", 
      icon: "text-red-600",
      fullBg: "bg-red-600"
    }
  }

  const theme = getTheme()

  return (
    <div className={`min-h-screen ${theme.fullBg} flex items-center justify-center p-2 md:p-4 font-sans transition-colors duration-700`}>
      <div ref={reportRef} className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Compact Header */}
        <div className="bg-slate-50 p-4 px-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">Rapport Médical • AI Triage</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Protocole PNLP • Côte d'Ivoire</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase font-black">ID: {consultationId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Column 1: Patient & Vitals (30%) */}
          <div className="md:col-span-3 p-4 bg-slate-50 border-r border-slate-100 space-y-4">
            {/* Patient Info */}
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" /> Fiche Patient
              </h3>
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-[11px] space-y-1 shadow-sm">
                <p><span className="text-slate-500">Âge :</span> <span className="font-bold text-slate-800">{questionnaire.age_years} ans {questionnaire.age_months > 0 && `${questionnaire.age_months}m`}</span></p>
                <p><span className="text-slate-500">Sexe :</span> <span className="font-bold text-slate-800">{questionnaire.gender === "M" ? "Masculin" : "Féminin"}</span></p>
                <p><span className="text-slate-500">Poids :</span> <span className="font-bold text-slate-800">{questionnaire.poids} kg</span></p>
                <p><span className="text-slate-500">Lieu :</span> <span className="font-bold text-slate-800">{questionnaire.district}</span></p>
              </div>
            </div>

            {/* Vitals */}
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Signes Vitaux
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <Thermometer className="w-3 h-3 text-red-400 mb-1" />
                  <p className="text-slate-500 text-[8px] uppercase font-black">Temp</p>
                  <p className="font-bold text-slate-800">{questionnaire.temperature_c}°C</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <Droplets className="w-3 h-3 text-blue-400 mb-1" />
                  <p className="text-slate-500 text-[8px] uppercase font-black">SpO2</p>
                  <p className="font-bold text-slate-800">{questionnaire.spo2_pct}%</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <Activity className="w-3 h-3 text-emerald-400 mb-1" />
                  <p className="text-slate-500 text-[8px] uppercase font-black">Pouls</p>
                  <p className="font-bold text-slate-800">{questionnaire.fc_bpm} bpm</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <Activity className="w-3 h-3 text-orange-400 mb-1" />
                  <p className="text-slate-500 text-[8px] uppercase font-black">Tension</p>
                  <p className="font-bold text-slate-800 leading-none">{questionnaire.pa_systolique}/{questionnaire.pa_diastolique}</p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase text-slate-400">Symptômes Déclarés</h3>
              <div className="flex flex-wrap gap-1">
                {symptoms.length > 0 ? symptoms.map((s, idx) => (
                  <span key={idx} className="bg-teal-50 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-teal-100 uppercase">
                    {s.label}
                  </span>
                )) : <span className="text-[9px] text-slate-400 italic">Aucun symptôme majeur</span>}
              </div>
            </div>
          </div>
          
          {/* Column 2: AI Result & Recommendations (70%) */}
          <div className="md:col-span-9 p-6 space-y-6 flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Circular UI */}
              <div className={`${theme.lightBg} p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-inner`}>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="50" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="56" cy="56" r="50"
                      stroke={theme.hex} strokeWidth="6" fill="transparent"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - data.score / 100)}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black tracking-tighter ${theme.text}`}>{data.score}%</span>
                    <span className="text-[8px] text-slate-400 font-black uppercase">Sévérité</span>
                  </div>
                </div>
                <div className={`mt-3 px-4 py-1.5 rounded-lg font-black text-xs tracking-widest uppercase shadow-md ${theme.fullBg} text-white`}>
                  RISQUE {data.riskLevel}
                </div>
              </div>

              {/* Orientation Banner */}
              <div className="space-y-3">
                <h3 className="text-[9px] font-black uppercase text-slate-400">Orientation Recommandée</h3>
                <div className={`p-5 rounded-2xl border-l-8 ${theme.lightBg} ${theme.border} text-slate-800 shadow-sm grow flex items-center`}>
                  <p className="text-xl font-black tracking-tight leading-tight">{data.orientation}</p>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-3">
              <h3 className="text-[9px] font-black uppercase text-slate-400">Actions Prioritaires & Conseils</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.recommendation.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <FileText className={`w-4 h-4 ${theme.icon} flex-shrink-0`} />
                    <p className="text-[11px] font-bold text-slate-700 leading-tight">{rec}</p>
                  </div>
                ))}
                {data.explanations.slice(0, 1).map((exp, idx) => (
                   <div key={`exp-${idx}`} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm border-l-4 border-l-blue-400">
                     <ShieldAlert className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                     <p className="text-[10px] font-medium text-slate-700 leading-tight italic">"{exp.value}"</p>
                   </div>
                ))}
              </div>
            </div>

            {/* Admin Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-start gap-2 max-w-sm">
                  <MapPin className="w-3 h-3 text-slate-300 mt-1 flex-shrink-0" />
                  <p className="text-[9px] text-slate-400 leading-tight font-medium uppercase tracking-wide">
                    Agent : {questionnaire.nurse_name} • {questionnaire.health_center} • PNLP V3.0
                  </p>
               </div>
               <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={handleDownloadPDF} 
                    disabled={isGenerating}
                    variant="outline" 
                    className="h-10 px-4 text-xs font-bold rounded-xl border-2 flex-1 sm:flex-none"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    {isGenerating ? "Calcul..." : "PDF"}
                  </Button>
                  <Button onClick={onNewTest} className="h-10 px-4 text-xs font-bold rounded-xl bg-slate-900 text-white flex-1 sm:flex-none">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Nouveau
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
