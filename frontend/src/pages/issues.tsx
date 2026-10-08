import CreateIssueDialog from "@/components/common/create-issue-dialog"
import { columns } from "@/components/common/issue-table/columns"
import { IssueTable } from "@/components/common/issue-table/issue-table"
import type { Issue } from "@/types/issue"
import { useEffect, useState } from "react"
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const Issues = () => {
  const [data, setData] = useState<Issue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/issues`, { signal: controller.signal })
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        const data = await response.json()
        setData(data)
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError')
            return
          else if (error.message) {
            setError(error.message)
          }
        }
        else setError('unknow error occured')
      } finally {
        setLoading(false)
      }
    }
    fetchIssues()
    return () => {
      controller.abort()
    }
  }, [])

  if (loading) {
    return <div className="p-10 text-muted-foreground">Loading issues...</div>
  }
  if (error) {
    return <div className="p-10 text-destructive">{error}</div>
  }
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="flex w-full justify-between">
        <h1 className="font-bold text-4xl">Issues</h1>
        <CreateIssueDialog />
      </div>
      <IssueTable data={data} columns={columns} />
    </div>
  )
}

export default Issues