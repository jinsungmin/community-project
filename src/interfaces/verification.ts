export interface IVerification {
  id: number
  email: string
  code: string
  confirmed: boolean
  used: boolean
  type: 'register' | 'reset'
}

export interface IVerificationCreate {
  email: string
  type: 'register' | 'reset'
}

export interface IVerificationUpdate extends Partial<IVerification> {
  id: number
}
