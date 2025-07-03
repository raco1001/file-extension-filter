'use client'

import { useState, useTransition } from 'react'
import type { ExtensionsResponse } from '@/lib/api/types'
import { FixedExtensions } from '@/app/extensions/components/fixed/FixedExtensions'
import { CustomExtensions } from '@/app/extensions/components/custom/CustomExtensions'
import {
  updateFixedExtensionAction,
  createCustomExtensionAction,
  deleteCustomExtensionAction,
} from '@/app/extensions/actions'
import { EXTENSION_CONSTANTS } from './BaseExtensions'

interface ExtensionsClientProps {
  initialData: ExtensionsResponse
}

export function ExtensionsClient({ initialData }: ExtensionsClientProps) {
  const [data, setData] = useState(initialData)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleFixedToggle = async (id: number, blocked: boolean) => {
    setError(null)

    setData((prev) => ({
      ...prev,
      fixed: prev.fixed.map((ext) =>
        ext.id === id ? { ...ext, blocked } : ext,
      ),
    }))

    startTransition(() => {
      updateFixedExtensionAction({ id, blocked })
        .then((result) => {
          if (!result.success) {
            setError(result.error || '설정 변경에 실패했습니다')
            setData((prev) => ({
              ...prev,
              fixed: prev.fixed.map((ext) =>
                ext.id === id ? { ...ext, blocked: !blocked } : ext,
              ),
            }))
          }
        })
        .catch((err) => {
          setError('설정 변경 중 오류가 발생했습니다')
          setData((prev) => ({
            ...prev,
            fixed: prev.fixed.map((ext) =>
              ext.id === id ? { ...ext, blocked: !blocked } : ext,
            ),
          }))
        })
    })
  }

  const handleAddCustom = async (name: string) => {
    setError(null)

    startTransition(() => {
      createCustomExtensionAction({ name })
        .then((result) => {
          if (result.success && result.data) {
            setData((prev) => ({
              ...prev,
              custom: [...prev.custom, result.data],
            }))
          } else {
            setError(result.error || '확장자 추가에 실패했습니다')
          }
        })
        .catch((err) => {
          setError('확장자 추가 중 오류가 발생했습니다')
        })
    })
  }

  const handleDeleteCustom = async (name: string) => {
    setError(null)

    setData((prev) => ({
      ...prev,
      custom: prev.custom.filter((ext) => ext.name !== name),
    }))

    deleteCustomExtensionAction({ name })
      .then((result) => {
        if (!result.success) {
          setError((result.error as string) || '확장자 삭제에 실패했습니다')
          window.location.reload()
        }
      })
      .catch((err) => {
        setError(err.message || '확장자 삭제 중 오류가 발생했습니다')
        window.location.reload()
      })
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center justify-between">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      <FixedExtensions
        extensions={data.fixed.map((ext) => ({
          ...ext,
          readonly: true as const,
        }))}
        onToggle={handleFixedToggle}
        isLoading={isPending}
        error={null}
      />

      <CustomExtensions
        extensions={data.custom.map((ext) => ({
          ...ext,
          readonly: false as const,
        }))}
        fixedExtensions={data.fixed.map((ext) => ext.name)}
        onAdd={handleAddCustom}
        onDelete={handleDeleteCustom}
        isLoading={isPending}
        isMax={data.custom.length >= EXTENSION_CONSTANTS.MAX_CUSTOM_EXTENSIONS}
        error={null}
      />
    </>
  )
}
