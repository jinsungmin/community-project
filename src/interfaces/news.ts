export interface INews {
    id: number
    url: string
    title: string
    author: string
}

export type INewsList = IResponseList<INews>