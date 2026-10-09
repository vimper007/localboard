import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '../ui/field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import type { Issue } from '@/types/issue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import React, { useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
type EditIssueDialogProps = {
    issue: Issue,
    onSuccess?: () => void
}

const items = [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in-progress" },
    { label: "Done", value: "done" },
]

const EditIssueDialog = ({ issue, onSuccess }: EditIssueDialogProps) => {
    const [title, setTitle] = useState(issue.title)
    const [description, setDescription] = useState(issue.description)
    const [status, setStatus] = useState(issue.status)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        console.log(e)
        try {
            const response = await fetch(`${BASE_URL}/api/v1/issues/${issue.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title,
                    description,
                    status
                })
            })
            if (!response.ok) throw new Error(`Response Status: ${response.status}`)
            onSuccess()
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Unknown Error has occured')
            }
        } finally {
            setLoading(false)
            setError('')
        }

    }
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline">Edit</Button>} />
            <DialogContent className="min-w-[30%] w-fit flex flex-col gap-4">
                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Issue</DialogTitle>
                        <DialogDescription>
                            Make changes to the Issue here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup >
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} />
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
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        maxLength={100}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Select items={items} defaultValue={status} onValueChange={(value) => setStatus(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup >
                                    {items.map((item) => (
                                        <SelectItem key={item.value} value={item.value} className="w-full" >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FieldGroup>
                    {error && <span>{error}</span>}
                    <DialogFooter className='mt-10'>
                        <DialogClose render={<Button variant="outline" disabled={loading}>Cancel</Button>} />
                        <Button type="submit" disabled={loading}>Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditIssueDialog