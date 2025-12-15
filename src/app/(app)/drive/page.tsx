import { HardDrive, Upload, FolderPlus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { getFiles, getFolders } from '@/lib/drive/actions'
import { DriveView } from './drive-view'
import { CreateFolderDialog } from './create-folder-dialog'
import { UploadFileButton } from './upload-file-button'

export default async function DrivePage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; search?: string }>
}) {
  const params = await searchParams
  const [files, folders] = await Promise.all([
    getFiles({ folderId: params.folder || null, search: params.search }),
    getFolders(params.folder || null),
  ])

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Drive"
        description="Manage and organize your files and documents."
      >
        <div className="flex gap-2">
          <CreateFolderDialog />
          <UploadFileButton />
        </div>
      </PageHeader>

      <DriveView files={files} folders={folders} currentFolderId={params.folder} />
    </div>
  )
}

