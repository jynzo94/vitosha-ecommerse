'use client'

import { useState } from 'react'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'

export default function AddressWithCountryForm() {
  const { createAddress } = useAddresses()
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('BG')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOk(false)
    try {
      await createAddress({ address: address, country })
      setOk(true)
      setAddress('') // по избор: изчисти полето
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
      <label className="block">
        Адрес:
        <input
          type="text"
          required
          placeholder="Въведи адрес"
          className="w-full rounded border px-2 py-1 mt-1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>

      <label className="block">
        Държава:
        <select
          name="country"
          required
          className="w-full rounded border px-2 py-1 mt-1"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="BG">Bulgaria</option>
          <option value="RO">Romania</option>
          <option value="GR">Greece</option>
          {/* добави още държави, ако искаш */}
        </select>
      </label>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {ok && <div className="text-green-600 text-sm">Адресът е записан успешно.</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded px-3 py-1 disabled:opacity-50"
      >
        {loading ? '…' : 'Запази'}
      </button>
    </form>
  )
}
