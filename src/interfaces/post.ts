export interface IPost {
    id: number
    userId: number
    userName?: string
    title: string
    content: string
    ratings: number
    ratingList?: Array<{id: number, userId: number, type: string}>
    createdAt: Date
    updatedAt: Date
}

export interface IPostCreate {
    id?: number
    userId: number
    title: string
    content: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IPostFindAll {
    search: string
    sort?: string
    order?: string
    userId?: number
    start: number
    perPage: number
}

export type IPostList = IResponseList<IPost>

export interface IPostUpdate extends Partial<IPost> {
    id: number
}

export interface IPostDelete extends Partial<IPost> {
    id: number
}
