import { EXTENSION_CONSTANTS } from '@/app/extensions/components/BaseExtensions'

export const validateExtensionName = (name: string): string | null => {
  const trimmed = name.trim().toLowerCase()

  if (!trimmed) return '확장자 이름이 필요합니다'
  if (trimmed.length < EXTENSION_CONSTANTS.MIN_EXTENSION_LENGTH) {
    return `확장자 이름은 최소 ${EXTENSION_CONSTANTS.MIN_EXTENSION_LENGTH}자 이상이어야 합니다`
  }
  if (trimmed.length > EXTENSION_CONSTANTS.MAX_EXTENSION_LENGTH) {
    return `확장자 이름은 ${EXTENSION_CONSTANTS.MAX_EXTENSION_LENGTH}자를 초과할 수 없습니다`
  }
  if (!/^[a-z0-9]+$/.test(trimmed)) {
    return '확장자 이름은 영문 소문자와 숫자만 사용할 수 있습니다'
  }

  return null
}

export const validateUpdateFixedExtension = (
  data: any,
): { id: number; blocked: boolean } | string => {
  if (!data || typeof data !== 'object') return '잘못된 요청 데이터입니다'
  if (typeof data.id !== 'number') return '확장자 ID가 필요합니다'
  if (typeof data.blocked !== 'boolean')
    return '차단 상태는 boolean 값이어야 합니다'

  return { id: data.id, blocked: data.blocked }
}

export const validateCreateCustomExtension = (
  data: any,
): { name: string } | string => {
  if (!data || typeof data !== 'object') return '잘못된 요청 데이터입니다'
  if (typeof data.name !== 'string') return '확장자 이름이 필요합니다'

  const nameError = validateExtensionName(data.name)
  if (nameError) return nameError

  return { name: data.name.trim().toLowerCase() }
}

export const validateDeleteCustomExtension = (
  data: any,
): { name: string } | string => {
  if (!data || typeof data !== 'object') return '잘못된 요청 데이터입니다'
  if (typeof data.name !== 'string') return '삭제할 확장자 이름이 필요합니다'

  return { name: data.name }
}

export const jsonValidator = (validateFn: (data: any) => any) => {
  return async (c: any, next: any) => {
    try {
      const data = await c.req.json()
      const result = validateFn(data)

      if (typeof result === 'string') {
        return c.json(
          {
            success: false,
            error: `검증 실패: ${result}`,
          },
          400,
        )
      }

      c.set('validatedData', result)
      await next()
    } catch (error) {
      return c.json(
        {
          success: false,
          error: '잘못된 JSON 형식입니다',
        },
        400,
      )
    }
  }
}

export type UpdateFixedExtensionRequest = { id: number; blocked: boolean }
export type CreateCustomExtensionRequest = { name: string }
export type DeleteCustomExtensionRequest = { name: string }
