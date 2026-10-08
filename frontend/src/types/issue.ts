export type IssueStatus = 'open' | 'done' | 'in-progress'
export type Issue = {
    id:string;
    title: string;
    description: string;
    status: IssueStatus;
    createdAt: string;
    updatedAt?: string
}
