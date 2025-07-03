import type { IBaseExtension } from '@/app/extensions/components/BaseExtensions'

export interface IFixedExtension extends IBaseExtension {
  id: number
  blocked: boolean
  readonly: true
}

export type IFixedExtensions = IFixedExtension[]

interface FixedExtensionsProps {
  extensions: IFixedExtensions
  onToggle: (id: number, blocked: boolean) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export const FixedExtensions = ({
  extensions,
  onToggle,
  isLoading = false,
  error = null,
}: FixedExtensionsProps) => {
  const handleToggle = async (id: number, blocked: boolean) => {
    try {
      await onToggle(id, blocked)
    } catch (error) {
      console.error('Failed to toggle extension:', error)
    }
  }

  return (
    <Section>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <CheckboxGrid>
        {extensions.map((ext) => (
          <ExtensionCheckbox
            key={ext.id}
            extension={ext}
            onToggle={handleToggle}
            disabled={isLoading}
          />
        ))}
      </CheckboxGrid>
    </Section>
  )
}

interface ExtensionCheckboxProps {
  extension: IFixedExtension
  onToggle: (id: number, blocked: boolean) => void
  disabled?: boolean
}

const ExtensionCheckbox = ({
  extension,
  onToggle,
  disabled = false,
}: ExtensionCheckboxProps) => (
  <CheckboxLabel>
    <StyledCheckbox
      type="checkbox"
      checked={extension.blocked}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onToggle(extension.id, e.target.checked)
      }
      disabled={disabled}
    />
    <CheckboxText>{extension.name}</CheckboxText>
  </CheckboxLabel>
)

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">{children}</div>
)

const CheckboxGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-x-6 gap-y-2">{children}</div>
)

const CheckboxLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    {children}
  </label>
)

const StyledCheckbox = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
    {...props}
  />
)

const CheckboxText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray-800">{children}</span>
)

const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
    {children}
  </div>
)
