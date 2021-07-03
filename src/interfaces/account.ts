export interface IAccount {
  userId: number
  type: 'email' | 'facebook' | 'naver' | 'kakao' | 'apple'
  accountId: string
  accountInfo?: Dictionary
}

export interface IAccountCreate {
  userId: number
  type: 'email' | 'facebook' | 'naver' | 'kakao' | 'apple'
  accountId: string
}

export interface IAccountUpdate extends Partial<IAccount> {
  userId: number
  type: 'email' | 'facebook' | 'naver' | 'kakao' | 'apple'
  accountInfo?: Dictionary
}
