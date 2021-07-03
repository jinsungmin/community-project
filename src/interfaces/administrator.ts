export interface IAdministrator {
  id: number
  name: string
  createdAt: Date
  updatedAt?: Date
}

export interface IAdministratorSecret extends IAdministrator {
  password: string
  salt: string
}

export type IAdministratorList = IResponseList<IAdministrator>

export interface IAdministratorCreate extends Omit<IAdministrator, 'id'> {
  password: string
  salt: string
}

export interface IAdministratorFindAll {
  search: string
  sort?: string
  order?: string
  start: number
  perPage: number
}

export interface IAdministratorUpdate {
  id: number
  name: string
  nickname: string
}

export interface IAdministratorUpdatePassword {
  id: number
  password: string
  salt: string
}

export interface IAdministratorDelete {
  id: number
}
