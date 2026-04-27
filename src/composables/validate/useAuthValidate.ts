import { toValue, type MaybeRefOrGetter } from "vue"

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: MaybeRefOrGetter<string>): string | null {
    const value = toValue(email).trim()

    if (!value) return 'Vui lòng nhập email.'
    if (!emailPattern.test(value)) return 'Email không đúng định dạng.'

    return null
}

export function validateOtp(otp: MaybeRefOrGetter<string>, length = 7): string | null {
    const value = toValue(otp).trim()

    if (value.length !== length) {
        return `Vui lòng nhập đầy đủ mã OTP gồm ${length} ký tự.`
    }

    return null
}

