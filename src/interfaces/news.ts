export interface INews {
    id: number
    url: string
    title: string
    pubDate: Date
}

export type INewsList = IResponseList<INews>