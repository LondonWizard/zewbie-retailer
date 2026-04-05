import { useEffect } from 'react'

/** Sets the document title on mount and restores it on unmount */
export default function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} — Zewbie Retailer`
    return () => {
      document.title = prev
    }
  }, [title])
}
