export interface PhoneConfig {
  max:         number
  placeholder: string
}

export const PHONE_CONFIG: Record<string, PhoneConfig> = {
  '+503': { max: 8,  placeholder: '70001234'   },
  '+502': { max: 8,  placeholder: '50001234'   },
  '+504': { max: 8,  placeholder: '90001234'   },
  '+505': { max: 8,  placeholder: '80001234'   },
  '+506': { max: 8,  placeholder: '80001234'   },
  '+507': { max: 8,  placeholder: '60001234'   },
  '+501': { max: 7,  placeholder: '6001234'    },
  '+1':   { max: 10, placeholder: '2001234567' },
  '+52':  { max: 10, placeholder: '5500001234' },
}

export function getPhoneConfig(countryCode: string): PhoneConfig {
  return PHONE_CONFIG[countryCode] ?? { max: 10, placeholder: '0000000000' }
}

/** Strips non-digits and clamps to maxLength */
export function cleanPhone(value: string, max: number): string {
  return value.replace(/\D/g, '').slice(0, max)
}
