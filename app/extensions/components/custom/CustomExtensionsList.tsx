import React, { memo, useCallback } from 'react'
import type { ICustomExtension } from './CustomExtensions'
import { EXTENSION_CONSTANTS } from '@/app/extensions/components/BaseExtensions'

interface CustomExtensionsListProps {
  extensions: ICustomExtension[]
  onDelete: (name: string) => Promise<void>
  isLoading?: boolean
}

export const CustomExtensionsList = memo(
  ({ extensions, onDelete, isLoading = false }: CustomExtensionsListProps) => {
    const handleDelete = useCallback(
      async (name: string) => {
        try {
          await onDelete(name)
        } catch (error) {
          console.error('Failed to delete extension:', error)
        }
      },
      [onDelete],
    )

    if (isLoading) {
      return (
        <TagContainer>
          <LoadingMessage>확장자 목록을 업데이트하는 중...</LoadingMessage>
        </TagContainer>
      )
    }

    return (
      <TagContainer>
        <TagGrid>
          {extensions.map((ext) => (
            <ExtensionTag
              key={ext.id}
              extension={ext}
              onDelete={handleDelete}
            />
          ))}
        </TagGrid>
        <Counter>
          {extensions.length}/{EXTENSION_CONSTANTS.MAX_CUSTOM_EXTENSIONS}
        </Counter>
      </TagContainer>
    )
  },
)

CustomExtensionsList.displayName = 'CustomExtensionsList'

interface ExtensionTagProps {
  extension: ICustomExtension
  onDelete: (name: string) => Promise<void>
}

const ExtensionTag = memo(({ extension, onDelete }: ExtensionTagProps) => {
  const handleClick = useCallback(() => {
    onDelete(extension.name)
  }, [extension.name, onDelete])

  return (
    <Tag>
      <TagText>{extension.name}</TagText>
      <DeleteButton onClick={handleClick}>&times;</DeleteButton>
    </Tag>
  )
})

ExtensionTag.displayName = 'ExtensionTag'

const TagContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="p-3 border border-gray-200 rounded-md bg-gray-50 min-h-[120px]">
    {children}
  </div>
)

const TagGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-2 mb-2">{children}</div>
)

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
    {children}
  </div>
)

const TagText = ({ children }: { children: React.ReactNode }) => (
  <span className="mr-1">{children}</span>
)

const DeleteButton = ({ ...props }) => (
  <button
    className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
    {...props}
  />
)

const Counter = ({ children }: { children: React.ReactNode }) => (
  <div className="text-right text-xs text-gray-500">{children}</div>
)

const LoadingMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center h-16 text-gray-500">
    {children}
  </div>
)
