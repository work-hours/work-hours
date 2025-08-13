import { Head, Link, useForm } from '@inertiajs/react'
import axios from 'axios'
import { Edit, LoaderCircle, Plus, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MasterLayout from '@/layouts/master-layout'

type Tag = {
    id: number
    name: string
    color: string
    created_at: string
}

type TagsLinks = {
    active: boolean
    label: string
    url: string | null
}

type TagsPageProps = {
    tags: {
        data: Tag[]
        links: TagsLinks[]
        total: number
        current_page: number
        last_page: number
    }
}

export default function Tags({ tags }: TagsPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<Tag | null>(null)
    const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tagsList, setTagsList] = useState<Tag[]>(tags.data)

    const { data, setData, reset, errors } = useForm({
        name: '',
    })

    const {
        data: editData,
        setData: setEditData,
        errors: editErrors,
    } = useForm({
        name: '',
        color: '',
    })

    const openCreateDialog = () => {
        reset()
        setIsCreateDialogOpen(true)
    }

    const openEditDialog = (tag: Tag) => {
        setEditingTag(tag)
        setEditData({ name: tag.name, color: tag.color })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (tag: Tag) => {
        setDeletingTag(tag)
        setIsDeleteDialogOpen(true)
    }

    const createTag = async () => {
        setIsLoading(true)

        try {
            const response = await axios.post('/tags', data)

            setTagsList([...tagsList, response.data])

            setIsCreateDialogOpen(false)
            reset()
            toast.success('Tag created successfully')
        } catch (error) {
            toast.error('Failed to create tag')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateTag = async () => {
        if (!editingTag) return

        setIsLoading(true)

        try {
            const response = await axios.put(`/tags/${editingTag.id}`, editData)

            setTagsList(tagsList.map((tag) => (tag.id === editingTag.id ? { ...tag, name: response.data.name, color: response.data.color } : tag)))

            setIsEditDialogOpen(false)
            setEditingTag(null)
            toast.success('Tag updated successfully')
        } catch (error) {
            toast.error('Failed to update tag')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteTag = async () => {
        if (!deletingTag) return

        setIsLoading(true)

        try {
            await axios.delete(`/tags/${deletingTag.id}`)

            setTagsList(tagsList.filter((tag) => tag.id !== deletingTag.id))

            setIsDeleteDialogOpen(false)
            setDeletingTag(null)
            toast.success('Tag deleted successfully')
        } catch (error) {
            toast.error('Failed to delete tag')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const breadcrumbs = [
        {
            title: 'Tags',
            href: '/tags',
        },
    ]

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tags" />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Tag Management</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your tags for time logs and projects</p>
                    <div className="mt-2 flex items-center justify-end">
                        <Button onClick={openCreateDialog} className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                            <Plus className="h-4 w-4" />
                            <span>Add new Tag</span>
                        </Button>
                    </div>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Your Tags</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    You have {tags.total} {(tags.total || 0) === 1 ? 'tag' : 'tags'}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {tagsList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">You don't have any tags yet.</p>
                                <Button onClick={openCreateDialog} className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    <Plus className="h-4 w-4" />
                                    <span>Add new Tag</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr>
                                            <th className="bg-gray-50 px-6 py-3 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">Tag Name</th>
                                            <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tagsList.map((tag) => (
                                            <tr key={tag.id} className="border-b border-gray-100 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-750">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tag.color || '#6366f1' }} />
                                                        {tag.name}
                                                    </div>
                                                </td>
                                                <td className="space-x-2 px-6 py-4 text-right">
                                                    <Button
                                                        onClick={() => openEditDialog(tag)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 w-7 border-amber-100 bg-amber-50 p-0 text-amber-700 shadow-sm transition-all duration-200 hover:border-amber-200 hover:bg-amber-100 hover:text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30"
                                                        title="Edit Tag"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => openDeleteDialog(tag)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 w-7 border-neutral-200 bg-red-100 p-0 text-red-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-red-800/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                                        title="Delete Tag"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination if there are multiple pages */}
                        {tags.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{tags?.current_page}</span> of{' '}
                                    <span className="font-medium">{tags?.last_page}</span> pages
                                </div>
                                <div className="flex space-x-2">
                                    {tags.links?.map((link: TagsLinks, i: number) => {
                                        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                            return null
                                        }

                                        return (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`rounded px-3 py-1 ${
                                                    link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Tag Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Create New Tag</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            createTag()
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Tag Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter tag name"
                                    disabled={isLoading}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsCreateDialogOpen(false)}
                                disabled={isLoading}
                                className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !data.name}
                                className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create tag
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Tag Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Edit Tag</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            updateTag().then()
                        }}
                    >
                        <div className="flex flex-row gap-4 py-4">
                            <div className="grid gap-2 w-10/12">
                                <Label htmlFor="edit-name">Tag Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    placeholder="Enter tag name"
                                    disabled={isLoading}
                                />
                                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-color">Tag Color</Label>
                                <Input
                                    id="edit-color"
                                    type="color"
                                    value={editData.color}
                                    onChange={(e) => setEditData('color', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsCreateDialogOpen(false)}
                                disabled={isLoading}
                                className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </Button>
                            <Button type="submit"
                                    className={'flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'}
                                    disabled={isLoading || !editData.name}>
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Tag
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Tag Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Delete Tag</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-neutral-700 dark:text-neutral-300">Are you sure you want to delete the tag "{deletingTag?.name}"?</p>
                        <p className="mt-2 text-sm text-red-500">This action cannot be undone. The tag will be removed from all time logs.</p>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isLoading}
                            className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={deleteTag}
                            disabled={isLoading}
                            className="bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-700/80 dark:hover:bg-red-700"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Tag
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MasterLayout>
    )
}
