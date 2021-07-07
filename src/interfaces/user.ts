export interface IUser {
  id: number
  email: string
  name: string
  profileUrl?: string
  createdAt: Date
}

export interface IUserCreate {
  name: string
  email: string
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
