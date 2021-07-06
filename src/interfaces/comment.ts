export interface IComment {
    id: number
    userId: number
    postId: number
    parentId: number
    content: string
    createdAt: Date
    updatedAt: Date
}

export interface ICommentCreate {
    id?: number
    userId: number
    postId: number
    parentId: number
    content: string
    createdAt?: Date
    updatedAt?: Date
}

export interface ICommentFindAll {
    search: string
    sort?: string
    order?: string
    userId?: number
    parentId?: number
    postId?: number
    start: number
    perPage: number
}

export type ICommentList = IResponseList<IComment>

export interface ICommentUpdate extends Partial<IComment> {
    id: number
}

export interface ICommentDelete extends Partial<IComment> {
    id: number
}

