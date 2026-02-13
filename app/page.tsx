"use client"

import AnalyticsDashboard from "@/components/screens/analytics-dashboard"
import AuthScreen from "@/components/screens/auth-screen"
import QuestionnaireScreen from "@/components/screens/questionnaire-screen"
import ResultScreen from "@/components/screens/result-screen"
import WelcomeScreen from "@/components/screens/welcome-screen"
import type { QuestionnaireData, ResultData } from "@/lib/types"
import { useState } from "react"

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "auth" | "questionnaire" | "result" | "dashboard">("welcome")
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<{ nurse_name: string; password: string } | null>(null)
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
  const [resultData, setResultData] = useState<ResultData | null>(null)

  const handleStartQuestionnaire = () => {
    setScreen("auth")
  }

  const handleLogin = (data: { nurse_name: string; password: string }) => {
    setSession(data)
    setScreen("questionnaire")
  }

  const handleShowDashboard = () => {
    setScreen("dashboard")
  }

  const handleQuestionnaireComplete = async (data: QuestionnaireData) => {
    setLoading(true)
    setQuestionnaireData(data)
    
    // Preparation of data for API
    const payload = {
      ...data,
      consultation_id: `CONS-${Date.now()}`,
      source_type: "kiosque",
      timestamp: new Date().toISOString()
    }

    console.log("=== FINAL PAYLOAD TO BACKEND ===", JSON.stringify(payload, null, 2))

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-kiosque.onrender.com"
      const response = await fetch(`${API_URL}/triage/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error("Erreur de communication avec le serveur")

      const result = await response.json()
      console.log("=== AI RESPONSE FROM BACKEND ===", result)
      
      // Map API result to ResultData
      const riskColorMap: Record<string, string> = {
        "Faible": "#34C759",
        "Modéré": "#FFC107",
        "Élevé": "#FF3B30",
        "Très Élevé": "#FF3B30"
      }

      setResultData({
        score: result.ml_scores.gravite_oms,
        riskLevel: result.risk_level,
        riskColor: riskColorMap[result.risk_level] || "#888",
        recommendation: result.clinical_guidelines.recommendations,
        orientation: result.clinical_guidelines.orientation,
        explanations: result.explanations
      })
      
      setScreen("result")
    } catch (error) {
      console.error("Triage Error:", error)
      alert("Une erreur est survenue lors du calcul du triage. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleNewTest = () => {
    setQuestionnaireData(null)
    setResultData(null)
    setScreen("questionnaire") // Go back to questionnaire directly if still authenticated
  }

  return (
    <main className="min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-teal-900 font-bold text-xl animate-pulse">Analyse Diagnostique en cours...</p>
        </div>
      )}
      {screen === "welcome" && <WelcomeScreen onStart={handleStartQuestionnaire} onShowDashboard={handleShowDashboard} />}
      {screen === "auth" && <AuthScreen onLogin={handleLogin} />}
      {screen === "questionnaire" && session && (
        <QuestionnaireScreen 
          onComplete={handleQuestionnaireComplete} 
          sessionData={session}
        />
      )}
      {screen === "result" && resultData && questionnaireData && (
        <ResultScreen 
          data={resultData} 
          questionnaire={questionnaireData}
          onNewTest={handleNewTest} 
        />
      )}
      {screen === "dashboard" && <AnalyticsDashboard onBack={() => setScreen("welcome")} />}
    </main>
  )
}
