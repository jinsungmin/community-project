export interface IRating {
    id: number
    postId?: number
    commentId?: number
    userId: number
    type: string
}

export interface IRatingCreate {
    id?: number
    postId?: number
    commentId?: number
    userId: number
    type: string
}

export interface IRatingFindAll {
    userId?: number
    postId?: number
    type?: string
    commentId?: number
}

export type IRatingList = IResponseList<IRating>

export interface IRatingUpdate extends Partial<IRating> {
    id: number
}

export interface IRatingDelete extends Partial<IRating> {
    id: number
}
