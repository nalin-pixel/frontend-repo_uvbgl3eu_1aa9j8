import { motion } from 'framer-motion'
import { Scale, PenTool, FileText } from 'lucide-react'

export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white">
            Generate Legal Contracts with AI
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300 max-w-prose">
            Jurisdiction-specific drafts for every province and state. Modern, minimal, and trustworthy.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button onClick={onStart} className="px-6 py-3 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
              Start Generating
            </button>
            <div className="flex gap-3 text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-2"><Scale size={18}/> Bauhaus simplicity</span>
              <span className="inline-flex items-center gap-2"><PenTool size={18}/> Smart drafting</span>
            </div>
          </div>
        </div>
        <div className="relative h-64 md:h-96">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <motion.div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-blue-500" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4 }} />
              <motion.div className="absolute -bottom-8 -right-10 w-28 h-28 rounded-full bg-yellow-400" animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 5 }} />
              <motion.div className="absolute left-10 top-10 w-56 h-36 bg-red-600 rotate-6" />
              <motion.div className="absolute left-14 top-14 w-56 h-36 bg-white dark:bg-black border-4 border-black dark:border-white flex items-center justify-center">
                <FileText className="text-black dark:text-white" size={42} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
