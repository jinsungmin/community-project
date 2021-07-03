export interface IUser {
  id: number
  name: string
  phone: string
  profileUrl?: string
  addressId?: number
  createdAt: Date
}

export interface IUserCreate {
  name: string
  phone: string
  profileUrl?: string
  createdAt?: Date
}

export interface IUserFindAll {
  search: string
  sort?: string
  order?: string
  start: number
  perPage: number
}

export type IUserList = IResponseList<IUser>

export interface IUserUpdate extends Partial<IUser> {
  id: number
}

export interface IUserUpdatePassword {
  id: number
  password: string
  salt: string
}
