import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import type { Issue } from '@/types/issue'

type DeleteIssueDialog = {
    issue: Issue
}

const DeleteIssueDialog = ({ issue }: DeleteIssueDialog) => {
    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="destructive">Delete</Button>} />
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Issue</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete { issue.title }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit" variant='destructive'>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default DeleteIssueDialog