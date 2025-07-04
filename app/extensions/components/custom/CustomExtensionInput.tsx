import React, { useState, useRef, useCallback } from 'react'
import type { ICustomExtension } from './CustomExtensions'
import { EXTENSION_CONSTANTS } from '@/app/extensions/components/BaseExtensions'

interface CustomExtensionInputProps {
  extensions: ICustomExtension[]
  fixedExtensions: string[]
  onAdd: (extensionName: string) => Promise<void>
  isLoading?: boolean
  isMax?: boolean
  error?: string | null
}

export const CustomExtensionInput = ({
  extensions,
  fixedExtensions,
  onAdd,
  isLoading = false,
  isMax = false,
  error = null,
}: CustomExtensionInputProps) => {
  const [newExtension, setNewExtension] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateExtension = useCallback(
    (value: string): string | null => {
      const trimmed = value.trim().toLowerCase()
      const safeExtensions = extensions || []
      const safeFixedExtensions = fixedExtensions || []

      if (!trimmed) return '확장자를 입력해주세요.'
      if (trimmed.length > EXTENSION_CONSTANTS.MAX_EXTENSION_LENGTH) {
        return `확장자는 최대 ${EXTENSION_CONSTANTS.MAX_EXTENSION_LENGTH}자까지 입력할 수 있습니다.`
      }
      if (safeExtensions.length >= EXTENSION_CONSTANTS.MAX_CUSTOM_EXTENSIONS) {
        return `커스텀 확장자는 최대 ${EXTENSION_CONSTANTS.MAX_CUSTOM_EXTENSIONS}개까지 추가할 수 있습니다.`
      }
      if (safeExtensions.some((ext) => ext.name === trimmed))
        return '이미 등록된 확장자입니다.'
      if (safeFixedExtensions.includes(trimmed))
        return '고정 확장자는 추가할 수 없습니다.'

      return null
    },
    [extensions, fixedExtensions],
  )

  const handleAddExtension = useCallback(async () => {
    const trimmed = newExtension.trim().toLowerCase()
    const validationError = validateExtension(trimmed)

    if (validationError) {
      alert(validationError)
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
      return
    }

    setIsSubmitting(true)

    try {
      await onAdd(trimmed)
      setNewExtension('')

      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } catch (error) {
      console.error('Failed to add extension:', error)
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [newExtension, validateExtension, onAdd])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleAddExtension()
      }
    },
    [handleAddExtension],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewExtension(e.target.value)
    },
    [],
  )

  const isDisabled = isLoading || isSubmitting || isMax

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <InputGroup>
        <input
          ref={inputRef}
          type="text"
          value={newExtension}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength={EXTENSION_CONSTANTS.MAX_EXTENSION_LENGTH}
          placeholder={
            isMax
              ? `최대 ${EXTENSION_CONSTANTS.MAX_CUSTOM_EXTENSIONS}개까지 추가할 수 있습니다.`
              : '확장자 입력'
          }
          disabled={isDisabled}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <AddButton
          onClick={handleAddExtension}
          disabled={isDisabled || !newExtension.trim()}
        >
          + 추가
        </AddButton>
      </InputGroup>
    </>
  )
}

const InputGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">{children}</div>
)

const AddButton = ({
  children,
  disabled,
  ...props
}: {
  children: React.ReactNode
  disabled?: boolean
  [key: string]: any
}) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      disabled
        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
        : 'bg-gray-700 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
    }`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
)

const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
    {children}
  </div>
)
