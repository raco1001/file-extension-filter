'use server'

import {
  updateFixedExtension,
  addCustomExtension,
  deleteCustomExtension,
} from '@/lib/supabase/queries'
import { revalidatePath } from 'next/cache'
import type {
  UpdateFixedExtensionRequest,
  CreateCustomExtensionRequest,
  DeleteCustomExtensionRequest,
} from '@/lib/hono/validators'

import {
  validateExtensionName,
  validateCreateCustomExtension,
  validateDeleteCustomExtension,
  validateUpdateFixedExtension,
} from '@/lib/hono/validators'

export async function updateFixedExtensionAction(
  data: UpdateFixedExtensionRequest,
) {
  try {
    const result = await updateFixedExtension(data.id, data.blocked)
    revalidatePath('/extensions')

    return {
      success: true,
      data: result,
      message: `고정 확장자 "${result.name}"이 성공적으로 업데이트되었습니다`,
    }
  } catch (error) {
    console.error('updateFixedExtensionAction error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '고정 확장자 업데이트 중 오류가 발생했습니다',
    }
  }
}

export async function createCustomExtensionAction(
  data: CreateCustomExtensionRequest,
) {
  try {
    const nameError = validateExtensionName(data.name)
    if (nameError) {
      return {
        success: false,
        error: nameError,
      }
    }

    const result = await addCustomExtension(data.name)
    revalidatePath('/extensions')

    return {
      success: true,
      data: result,
      message: `커스텀 확장자 "${data.name}"이 성공적으로 추가되었습니다`,
    }
  } catch (error) {
    console.error('createCustomExtensionAction error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '커스텀 확장자 생성 중 오류가 발생했습니다',
    }
  }
}

export async function deleteCustomExtensionAction(
  data: DeleteCustomExtensionRequest,
) {
  try {
    const validation = validateDeleteCustomExtension(data)
    if (typeof validation === 'string') {
      return {
        success: false,
        error: validation,
      }
    }

    await deleteCustomExtension(validation.name)
    revalidatePath('/extensions')

    return {
      success: true,
      message: `커스텀 확장자 "${validation.name}"이 성공적으로 삭제되었습니다`,
    }
  } catch (error) {
    console.error('deleteCustomExtensionAction error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '커스텀 확장자 삭제 중 오류가 발생했습니다',
    }
  }
}
