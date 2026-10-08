import { columns } from "@/components/common/issue-table/columns"
import { issue } from "@/components/common/issue-table/issue"
import { IssueTable } from "@/components/common/issue-table/issue-table"

const Issues = () => {
  return (
    <div>
      <h1 className="font-bold text-4xl mb-4">Issues</h1>
      <IssueTable data={issue} columns={columns}/>
    </div>
  )
}

export default Issues