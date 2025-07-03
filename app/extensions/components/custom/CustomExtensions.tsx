import type { IBaseExtension } from '@/app/extensions/components/BaseExtensions'
import { CustomExtensionInput } from './CustomExtensionInput'
import { CustomExtensionsList } from './CustomExtensionsList'
import { useState, useCallback } from 'react'

export interface ICustomExtension extends IBaseExtension {
  id: number
  readonly: false
}

export type ICustomExtensions = ICustomExtension[]

interface CustomExtensionsProps {
  extensions: ICustomExtensions
  fixedExtensions: string[]
  onAdd: (extensionName: string) => Promise<void>
  onDelete: (extensionName: string) => Promise<void>
  isLoading?: boolean
  isMax?: boolean
  error?: string | null
}

export const CustomExtensions = ({
  extensions,
  fixedExtensions,
  onAdd,
  onDelete,
  isLoading = false,
  isMax = false,
  error = null,
}: CustomExtensionsProps) => {
  const [isListLoading, setIsListLoading] = useState(false)

  const handleAdd = useCallback(
    async (extensionName: string) => {
      setIsListLoading(true)
      try {
        await onAdd(extensionName)
      } finally {
        setTimeout(() => {
          setIsListLoading(false)
        }, 100)
      }
    },
    [onAdd],
  )

  const handleDelete = useCallback(
    async (extensionName: string) => {
      setIsListLoading(true)
      try {
        await onDelete(extensionName)
      } finally {
        setTimeout(() => {
          setIsListLoading(false)
        }, 100)
      }
    },
    [onDelete],
  )

  return (
    <Section>
      <SectionTitle>커스텀 확장자</SectionTitle>

      <CustomExtensionInput
        extensions={extensions || []}
        fixedExtensions={fixedExtensions || []}
        onAdd={handleAdd}
        isLoading={isLoading}
        isMax={isMax}
        error={error}
      />

      <CustomExtensionsList
        extensions={extensions || []}
        onDelete={handleDelete}
        isLoading={isListLoading}
      />
    </Section>
  )
}

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">{children}</div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-semibold text-gray-700 mb-2">{children}</h2>
)
