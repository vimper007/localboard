import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'



const items = [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in-progress" },
    { label: "Done", value: "done" },
]
type CreateIssueDialogProps = {
    onSuccess?: () => void
}
const CreateIssueDialog = ({onSuccess}:CreateIssueDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" size='lg'>Create Issue</Button>} />
            <DialogContent className="min-w-[30%] w-fit flex flex-col gap-4">
                <form className='flex flex-col gap-6'>
                    <DialogHeader>
                        <DialogTitle>Create Issue</DialogTitle>
                        <DialogDescription>
                            Create new Issue here.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup >
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" />
                        </Field>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="checkout-7j9-optional-comments">
                                        Description
                                    </FieldLabel>
                                    <Textarea
                                        id="checkout-7j9-optional-comments"
                                        placeholder="Add any additional comments"
                                        className="resize-none"
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Select items={items}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {items.map((item) => (
                                        <SelectItem key={item.value} value={item.value} className="w-full">
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FieldGroup>
                    <DialogFooter className='mt-10'>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateIssueDialog