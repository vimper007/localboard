import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Field, FieldGroup } from '../ui/field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import type { Issue } from '@/types/issue'

type EditIssueDialogProps = {
    issue: Issue
}

const EditIssueDialog = ({ issue }: EditIssueDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline">Edit</Button>} />
            <DialogContent className="sm:max-w-sm">
                <form>
                    <DialogHeader>
                        <DialogTitle>Edit Issue</DialogTitle>
                        <DialogDescription>
                            Make changes to the Issue here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={issue.title} />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={issue.description} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditIssueDialog