import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import Hero from './components/Hero'
import Wizard from './components/Wizard'
import Output from './components/Output'

function App() {
  const [dark, setDark] = useState(false)
  const [contract, setContract] = useState(null)

  return (
    <div className={dark? 'dark bg-black text-white' : ''}>
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-black/50 border-b border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600" />
            <div>
              <p className="font-extrabold tracking-tight">LexCraft AI</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 -mt-1">AI-generated professional contracts for every province and state.</p>
            </div>
          </div>
          <button onClick={()=>setDark(d=>!d)} className="px-3 py-2 rounded-md border border-black/10 dark:border-white/10 inline-flex items-center gap-2">
            {dark ? (<><Sun size={16}/> Light</>) : (<><Moon size={16}/> Dark</>)}
          </button>
        </div>
      </header>

      <main>
        <Hero onStart={() => {
          const el = document.getElementById('wizard')
          el?.scrollIntoView({ behavior: 'smooth' })
        }} />

        <div id="wizard">
          <Wizard onGenerated={setContract} />
        </div>

        {contract && <Output contract={contract} />}
      </main>

      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-2 gap-6 items-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Not legal advice – generated draft for review only.</p>
          <div className="flex justify-end gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"/>
            <div className="w-3 h-3 rounded-full bg-yellow-400"/>
            <div className="w-3 h-3 rounded-full bg-red-600"/>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
