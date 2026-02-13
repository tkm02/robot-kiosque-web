"use client"

import { Button } from "@/components/ui/button"
import { IVORY_COAST_LOCATIONS } from "@/lib/locations"
import { questions } from "@/lib/questions"
import type { QuestionnaireData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertTriangle, ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react"
import { useMemo, useState } from "react"

interface QuestionnaireScreenProps {
  onComplete: (data: QuestionnaireData) => void
  sessionData: { nurse_name: string }
}

export default function QuestionnaireScreen({ onComplete, sessionData }: QuestionnaireScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuestionnaireData>>({
    robot_id: "KIOSK-CI-001", // Mock robot ID
    nurse_name: sessionData.nurse_name,
    source_type: "kiosque",
    data_quality_status: "en revue",
  })
  const [error, setError] = useState("")

  // Filter visible questions based on current answers
  const visibleQuestions = useMemo(() => {
    return questions.filter(q => !q.visibleIf || q.visibleIf(answers))
  }, [answers])

  const currentQuestion = visibleQuestions[currentStepIndex]
  const progress = ((currentStepIndex + 1) / visibleQuestions.length) * 100

  const handleAnswer = (field: string, value: any, autoAdvance = false) => {
    let latestAnswers: Partial<QuestionnaireData> = {}
    
    setAnswers((prev) => {
      const next = { ...prev, [field]: value }
      latestAnswers = next
      
      return next
    })
    setError("")

    // UX Improvement: Auto-advance for unambiguous choices
    if (autoAdvance) {
      setTimeout(() => {
        handleNext(latestAnswers)
      }, 300) // Small delay for visual feedback
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleNext()
    }
  }

  const handleNext = (overrideAnswers?: Partial<QuestionnaireData>) => {
    const question = currentQuestion
    if (!question) return
    
    const currentAnswers = overrideAnswers || answers
    const value = currentAnswers[question.field as keyof QuestionnaireData]

    // Validation
    if (question.required) {
      if (value === undefined || value === "" || (typeof value === "number" && isNaN(value))) {
        setError("Veuillez remplir ce champ pour continuer")
        return
      }
      
      if (question.type === "number" && question.validation) {
        const num = value as number
        if (question.validation.min !== undefined && num < question.validation.min) {
          setError(`La valeur minimale est ${question.validation.min}`)
          return
        }
        if (question.validation.max !== undefined && num > question.validation.max) {
          setError(`La valeur maximale est ${question.validation.max}`)
          return
        }
      }
    }

    if (currentStepIndex < visibleQuestions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      onComplete(currentAnswers as QuestionnaireData)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
      setError("")
    }
  }

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setAnswers(prev => ({
          ...prev,
          gps_latitude: position.coords.latitude,
          gps_longitude: position.coords.longitude
        }))
        // Auto-advance after getting location
        setTimeout(() => handleNext(), 500)
      })
    }
  }


  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header with Progress */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 w-full">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              Étape {currentStepIndex + 1} / {visibleQuestions.length}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            onClick={() => window.location.reload()}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-teal-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-2xl animate-fade-in space-y-8">
          <div className="space-y-6 text-center">
            <span className="text-6xl filter drop-shadow-sm">{currentQuestion.icon}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {currentQuestion.question}
            </h2>
            {currentQuestion.helpText && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                <HelpCircle className="w-4 h-4" />
                {currentQuestion.helpText}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            {/* Input Types */}
            {currentQuestion.type === "radio" && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.field as keyof QuestionnaireData] === option.value
                  return (
                    <button
                      key={option.value.toString()}
                      onClick={() => handleAnswer(currentQuestion.field, option.value, true)}
                      className={cn(
                        "w-full p-6 text-left rounded-xl border-2 transition-all duration-200",
                        isSelected
                          ? "border-teal-500 bg-teal-50/50 shadow-md ring-1 ring-teal-500"
                          : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xl font-medium", isSelected ? "text-teal-900" : "text-slate-700")}>
                          {option.label}
                        </span>
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", 
                          isSelected ? "border-teal-500 bg-teal-500" : "border-slate-300")}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {currentQuestion.type === "number" && (
              <div className="max-w-xs mx-auto space-y-6">
                <input
                  type="number"
                  value={(answers[currentQuestion.field as keyof QuestionnaireData] as number) || ""}
                  onChange={(e) => handleAnswer(currentQuestion.field, parseFloat(e.target.value))}
                  onKeyDown={handleKeyDown}
                  className="w-full text-center text-4xl font-bold text-slate-900 p-6 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none"
                  autoFocus
                />
                
                {currentQuestion.suggestions && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentQuestion.suggestions.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleAnswer(currentQuestion.field, s.value, true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700 rounded-full text-sm font-bold border border-slate-200 hover:border-teal-200 transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentQuestion.type === "text" && (
              <div className="max-w-md mx-auto space-y-6">
                <input
                  type="text"
                  value={(answers[currentQuestion.field as keyof QuestionnaireData] as string) || ""}
                  onChange={(e) => handleAnswer(currentQuestion.field, e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-center text-2xl font-bold text-slate-900 p-6 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none"
                  autoFocus
                />
                
                {currentQuestion.suggestions && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentQuestion.suggestions.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleAnswer(currentQuestion.field, s.value, true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700 rounded-full text-sm font-bold border border-slate-200 hover:border-teal-200 transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentQuestion.type === "date" && (
              <div className="max-w-md mx-auto space-y-6">
                <input
                  type="date"
                  value={(answers[currentQuestion.field as keyof QuestionnaireData] as string) || ""}
                  onChange={(e) => handleAnswer(currentQuestion.field, e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-center text-2xl font-bold text-slate-900 p-6 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none"
                  autoFocus
                />
                
                {currentQuestion.suggestions && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentQuestion.suggestions.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleAnswer(currentQuestion.field, s.value, true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700 rounded-full text-sm font-bold border border-slate-200 hover:border-teal-200 transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentQuestion.type === "checkbox" && currentQuestion.checkboxes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.checkboxes.map((checkbox) => {
                  const isChecked = !!answers[checkbox.field as keyof QuestionnaireData]
                  return (
                    <label key={checkbox.field} className={cn(
                      "flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all",
                      isChecked ? "border-teal-500 bg-teal-50/50" : "border-slate-200 bg-white"
                    )}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleAnswer(checkbox.field, e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-4"
                      />
                      <span className={cn("text-lg font-medium", isChecked ? "text-teal-900" : "text-slate-700")}>
                        {checkbox.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}

            {currentQuestion.type === "synced-select" && (
              <div className="max-w-md mx-auto space-y-4">
                <select
                  className="w-full p-6 bg-white rounded-2xl border-2 border-slate-200 text-2xl font-bold text-slate-900 focus:border-teal-500 focus:outline-none"
                  value={(answers[currentQuestion.field as keyof QuestionnaireData] as string) || ""}
                  onChange={(e) => handleAnswer(currentQuestion.field, e.target.value, currentQuestion.field === "commune")}
                >
                  <option value="">Sélectionner...</option>
                  {/* Handle locations based on dependency */}
                  {!currentQuestion.dependsOn && IVORY_COAST_LOCATIONS.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                  {currentQuestion.field === "region" && answers.district && 
                    IVORY_COAST_LOCATIONS.find(d => d.value === answers.district)?.children?.map(reg => (
                      <option key={reg.value} value={reg.value}>{reg.label}</option>
                    ))
                  }
                  {currentQuestion.field === "commune" && answers.region && 
                    IVORY_COAST_LOCATIONS.find(d => d.value === answers.district)?.children?.find(r => r.value === answers.region)?.children?.map(com => (
                      <option key={com.value} value={com.value}>{com.label}</option>
                    ))
                  }
                </select>
              </div>
            )}

            {currentQuestion.type === "geolocation" && (
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={handleGeolocation}
                  className="px-8 py-8 rounded-2xl bg-teal-600 hover:bg-teal-700 text-xl font-bold shadow-xl"
                >
                  Activer la Géolocalisation
                </Button>
                {answers.gps_latitude && (
                  <div className="text-teal-600 font-mono text-sm bg-teal-50 px-4 py-2 rounded-lg">
                    LAT: {answers.gps_latitude.toFixed(4)} | LON: {answers.gps_longitude?.toFixed(4)}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-100 p-4 md:p-6 sticky bottom-0 z-10">
        <div className="max-w-xl mx-auto flex justify-between gap-4">
          <Button onClick={handlePrevious} disabled={currentStepIndex === 0} variant="ghost" size="lg" className="flex-1">
            <ChevronLeft className="mr-2 h-5 w-5" /> Retour
          </Button>
          <Button onClick={() => handleNext()} size="lg" className="flex-[2] bg-teal-600 hover:bg-teal-700 text-lg shadow-lg">
            {currentStepIndex === visibleQuestions.length - 1 ? "Calculer le risque" : "Continuer"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
