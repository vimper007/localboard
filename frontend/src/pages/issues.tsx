import CreateIssueDialog from "@/components/common/create-issue-dialog"
import { columns } from "@/components/common/issue-table/columns"
import { issue } from "@/components/common/issue-table/issue"
import { IssueTable } from "@/components/common/issue-table/issue-table"
import type { Issue } from "@/types/issue"
import { useEffect, useState } from "react"
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const Issues = () => {
  // const [data, setData] = useState<Issue|null>(null)
  // const [IsError, setIsError] = useState()
  // const [isLoading, setisLoading] = useState()

  // useEffect(() => {
  //   const fetchIssues = async() => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/api/v1/issues`)
  //       const data = await response.json()
  //       if(!data.ok) throw new Error('')
  //       setData(data)
  //     } catch (error) {
  //       setIsError(error)
  //     }

  //   }
  //   return () => {
  //   }
  // }, [])
  

  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="flex w-full justify-between">
        <h1 className="font-bold text-4xl">Issues</h1>
        <CreateIssueDialog />
      </div>
      <IssueTable data={issue} columns={columns} />
    </div>
  )
}

export default Issues