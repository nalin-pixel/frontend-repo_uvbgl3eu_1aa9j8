import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map, FileSignature, ChevronRight, ChevronLeft } from 'lucide-react'

const countries = ['Canada', 'U.S.']
const provinces = ['Ontario', 'British Columbia', 'Alberta', 'Quebec']
const states = ['California', 'New York', 'Texas', 'Florida']
const contractTypes = [
  'Residential Lease',
  'Car Rental',
  'Service Agreement',
  'Employment Contract',
  'NDA',
]

export default function Wizard({ onGenerated }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    country: 'Canada',
    region: 'Ontario',
    contract_type: 'Residential Lease',
    parties: [
      { role: 'Party A', name: '', address: '' },
      { role: 'Party B', name: '', address: '' },
    ],
    key_terms: { start_date: '', end_date: '', price: '', frequency: 'Monthly', security_deposit: '' },
    clauses: ['Standard maintenance obligations.', 'Compliance with applicable laws.'],
    title: '',
  })

  useEffect(() => {
    if (form.country === 'Canada' && !provinces.includes(form.region)) {
      setForm(f => ({ ...f, region: provinces[0] }))
    }
    if (form.country === 'U.S.' && !states.includes(form.region)) {
      setForm(f => ({ ...f, region: states[0] }))
    }
  }, [form.country])

  const regions = useMemo(() => (form.country === 'Canada' ? provinces : states), [form.country])

  const next = () => setStep(s => Math.min(s + 1, 3))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const submit = async () => {
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/contracts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: form.country,
          region: form.region,
          contract_type: form.contract_type,
          parties: form.parties,
          key_terms: form.key_terms,
          clauses: form.clauses,
          title: form.title,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate')
      const data = await res.json()
      onGenerated?.(data)
      setStep(3)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const StepWrap = ({ children }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <section className="bg-white dark:bg-black py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          <div className={`h-2 rounded-full ${step>=0?'bg-blue-500':'bg-neutral-200'} w-24`} />
          <div className={`h-2 rounded-full ${step>=1?'bg-red-600':'bg-neutral-200'} w-24`} />
          <div className={`h-2 rounded-full ${step>=2?'bg-yellow-400':'bg-neutral-200'} w-24`} />
          <div className={`h-2 rounded-full ${step>=3?'bg-black dark:bg-white':'bg-neutral-200'} w-24`} />
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3">
            {step === 0 && (
              <StepWrap>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2"><Globe size={22}/> Jurisdiction</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Country</label>
                      <select value={form.country} onChange={e=>setForm(f=>({ ...f, country: e.target.value }))} className="mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2">
                        {countries.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Province/State</label>
                      <select value={form.region} onChange={e=>setForm(f=>({ ...f, region: e.target.value }))} className="mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2">
                        {regions.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Contract Type</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {contractTypes.map(type => (
                        <button key={type} onClick={()=>setForm(f=>({ ...f, contract_type: type }))} className={`px-3 py-2 rounded-md border text-sm ${form.contract_type===type? 'bg-blue-500 text-white border-blue-500':'border-black/10 dark:border-white/10 text-black dark:text-white'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepWrap>
            )}

            {step === 1 && (
              <StepWrap>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2"><Map size={22}/> Parties & Terms</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {form.parties.map((p, i) => (
                      <div key={i} className="space-y-2 p-3 rounded-md border border-black/10 dark:border-white/10">
                        <input value={p.role} onChange={e=>setForm(f=>{ const arr=[...f.parties]; arr[i]={...arr[i], role:e.target.value}; return { ...f, parties: arr } })} className="w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Role (Landlord)"/>
                        <input value={p.name} onChange={e=>setForm(f=>{ const arr=[...f.parties]; arr[i]={...arr[i], name:e.target.value}; return { ...f, parties: arr } })} className="w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Name"/>
                        <input value={p.address} onChange={e=>setForm(f=>{ const arr=[...f.parties]; arr[i]={...arr[i], address:e.target.value}; return { ...f, parties: arr } })} className="w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Address"/>
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={form.key_terms.start_date} onChange={e=>setForm(f=>({ ...f, key_terms: { ...f.key_terms, start_date: e.target.value }}))} className="px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Start Date"/>
                    <input value={form.key_terms.end_date} onChange={e=>setForm(f=>({ ...f, key_terms: { ...f.key_terms, end_date: e.target.value }}))} className="px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="End Date"/>
                    <input value={form.key_terms.price} onChange={e=>setForm(f=>({ ...f, key_terms: { ...f.key_terms, price: e.target.value }}))} className="px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Price / Rate"/>
                    <input value={form.key_terms.frequency} onChange={e=>setForm(f=>({ ...f, key_terms: { ...f.key_terms, frequency: e.target.value }}))} className="px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Frequency (Monthly)"/>
                    <input value={form.key_terms.security_deposit} onChange={e=>setForm(f=>({ ...f, key_terms: { ...f.key_terms, security_deposit: e.target.value }}))} className="px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Security Deposit"/>
                  </div>

                  <textarea value={form.title} onChange={e=>setForm(f=>({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10" placeholder="Custom Title (optional)"/>
                </div>
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2"><FileSignature size={22}/> Clauses</h2>
                  <div className="space-y-3">
                    {form.clauses.map((c, i) => (
                      <input key={i} value={c} onChange={e=>setForm(f=>{ const arr=[...f.clauses]; arr[i]=e.target.value; return { ...f, clauses: arr } })} className="w-full px-3 py-2 rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10"/>
                    ))}
                    <button onClick={()=>setForm(f=>({ ...f, clauses: [...f.clauses, ''] }))} className="px-3 py-2 rounded-md bg-yellow-400 text-black font-semibold">Add Clause</button>
                  </div>
                </div>
              </StepWrap>
            )}

            {step === 3 && (
              <StepWrap>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white">Draft Generated</h2>
                  <p className="text-neutral-600 dark:text-neutral-300">Your contract draft is ready below. You can download it or go back to edit inputs.</p>
                </div>
              </StepWrap>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button onClick={prev} disabled={step===0} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black/10 dark:border-white/10 text-black dark:text-white disabled:opacity-40">
                <ChevronLeft size={18}/> Back
              </button>
              {step < 2 && (
                <button onClick={next} className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
                  Next <ChevronRight size={18}/>
                </button>
              )}
              {step === 2 && (
                <button onClick={submit} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-red-600 text-white">
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg border-2 border-black dark:border-white p-4 min-h-[240px]">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">Tips</p>
              <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-200 space-y-1 mt-2">
                <li>Use legal names for parties and addresses.</li>
                <li>Provide clear dates and payment terms.</li>
                <li>Review the generated draft carefully before use.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
