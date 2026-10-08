// https://ui.shadcn.com/docs/components/base/data-table
// https://tanstack.com/table/latest/docs/guide/column-defs


import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./issue-table-features"
import type { Issue } from "@/types/issue"
import { capitaliseStatus } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import EditIssueDialog from "../edit-issue-dialog"
import DeleteIssueDialog from "../delete-issue-dialog"



// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Issue>()

export const columns = columnHelper.columns([

    columnHelper.accessor("title", {
        header: "Title",
    }),
    columnHelper.accessor("description", {
        header: "Description",
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.row.original.status
            return (
                <Badge variant={status === 'done' ? 'default' : status === 'in-progress' ? 'outline' : 'destructive'}>{capitaliseStatus(status)}</Badge>
            )
        }

    }),
    columnHelper.display({
        id: 'actions',
        header: ()=><div>Actions</div>,
        cell: (info) => {
            const currentIssue = info.row.original
            return (
                <div className="flex gap-2">
                    <EditIssueDialog issue={currentIssue} />
                    <DeleteIssueDialog issue={currentIssue} />
                </div>
            )
        }
    })
])