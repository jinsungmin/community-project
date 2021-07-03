export interface IVerification {
  id: number
  phone: string
  code: string
  confirmed: boolean
  used: boolean
  type: 'register' | 'reset' | 'changePhone'
}

export interface IVerificationCreate {
  phone: string
  type: 'register' | 'reset' | 'changePhone'
}

export interface IVerificationUpdate extends Partial<IVerification> {
  id: number
}
