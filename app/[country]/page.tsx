'use client'

export default function CountryPage({
  params,
}: {
  params: { country: string }
}) {
  return (
    <div>
      <h1>K1BO - {params.country.toUpperCase()}</h1>
    </div>
  )
}
