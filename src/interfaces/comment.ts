export interface IComment {
    id: number
    parentId: number
    content: string
    createdAt: Date
    updatedAt: Date
}

export interface ICommentCreate {
    parentId: number
    content: string
}

export interface ICommentFindAll {
    search: string
    sort?: string
    order?: string
    start: number
    perPage: number
}

export type ICommentList = IResponseList<IComment>

export interface ICommentUpdate extends Partial<IComment> {
    id: number
}

