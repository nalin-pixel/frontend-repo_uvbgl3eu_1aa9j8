import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw, Pencil } from 'lucide-react'

export default function Output({ contract }) {
  const [doc, setDoc] = useState(contract)
  useEffect(()=>{ setDoc(contract) }, [contract])
  if (!doc) return null

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const pdfUrl = `${base}/api/contracts/${doc.id}/download.pdf`
  const docxUrl = `${base}/api/contracts/${doc.id}/download.docx`

  return (
    <section className="bg-neutral-50 dark:bg-neutral-950 py-16 border-t border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-black rounded-xl border-2 border-black dark:border-white overflow-hidden">
          <div className="px-4 py-3 border-b-2 border-black dark:border-white flex items-center justify-between">
            <h3 className="font-bold">Contract Preview</h3>
            <div className="flex gap-2">
              <a href={pdfUrl} className="px-3 py-1.5 rounded-md bg-blue-500 text-white inline-flex items-center gap-2"><Download size={16}/> PDF</a>
              <a href={docxUrl} className="px-3 py-1.5 rounded-md bg-yellow-400 text-black inline-flex items-center gap-2"><Download size={16}/> DOCX</a>
            </div>
          </div>
          <div className="p-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-black dark:border-white p-4 bg-white dark:bg-black">
            <h4 className="font-semibold mb-2">Legal Notes</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{doc.notes || 'Add relevant jurisdiction citations.'}</p>
          </div>
          <div className="rounded-xl border-2 border-black dark:border-white p-4 bg-white dark:bg-black">
            <h4 className="font-semibold mb-2">Actions</h4>
            <div className="flex gap-3">
              <button className="px-3 py-2 rounded-md bg-red-600 text-white inline-flex items-center gap-2"><RotateCcw size={16}/> Regenerate</button>
              <button className="px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black inline-flex items-center gap-2"><Pencil size={16}/> Edit</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
