export interface ICategory {
    id: number
    name: string
}

export interface ICategoryCreate {
    id?: number
    name: string
}

export interface ICategoryFindAll {
    search: string
    sort?: string
    order?: string
}

export type ICategoryList = IResponseList<ICategory>

export interface ICategoryUpdate extends Partial<ICategory> {
    id: number
}

export interface ICategoryDelete extends Partial<ICategory> {
    id: number
}

