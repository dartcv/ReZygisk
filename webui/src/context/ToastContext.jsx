import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const TOAST_DURATION_MS = 2600
const MAX_VISIBLE = 3

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const nextId = useRef(0)

  const push = useCallback((message) => {
    nextId.current += 1
    const id = nextId.current

    setItems((list) => [...list.slice(-(MAX_VISIBLE - 1)), { id, message }])
    setTimeout(() => {
      setItems((list) => list.filter((item) => item.id !== id))
    }, TOAST_DURATION_MS)
  }, [])

  useEffect(() => {
    function onNotify(event) {
      push(event.detail)
    }

    window.addEventListener('rz:toast', onNotify)

    return () => window.removeEventListener('rz:toast', onNotify)
  }, [push])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className='toast-stack' role='status' aria-live='polite'>
        {items.map((item) => (
          <div key={item.id} className='toast'>{item.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
