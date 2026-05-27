import { useTimerStore } from '../store/timerStore'
import { translations } from './index'

export function useI18n() {
  const language = useTimerStore((s) => s.language)
  return translations[language]
}
