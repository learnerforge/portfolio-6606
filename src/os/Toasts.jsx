'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './ui/Icon'

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t.slice(-2), { id, msg, kind }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 4200)
  }, [])
  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])
  return { toasts, push, dismiss }
}

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-12 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => onDismiss(t.id)}
            className={`toast os-bar pointer-events-auto flex items-center gap-2.5 shadow-card`}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
            {t.msg}
            <Icon name="x" size={11} className="text-faint" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}