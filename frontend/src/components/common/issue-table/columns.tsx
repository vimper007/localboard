// https://ui.shadcn.com/docs/components/base/data-table


import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./issue-table-features"
import type { Issue } from "@/types/issue"
import { Button } from "@/components/ui/button"
import { capitaliseStatus } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"



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
        header: 'Actions',
        cell: (info) => {
            const currentIssue = info.row.original
            return (
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => console.log(currentIssue)}>Edit</Button>
                    <Button variant="destructive" onClick={() => currentIssue}>Delete</Button>
                </div>
            )
        }
    })
])