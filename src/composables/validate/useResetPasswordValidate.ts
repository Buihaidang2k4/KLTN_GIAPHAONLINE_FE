export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


export function validatePassword(password: string) {
    if (!password) {
        return 'Vui lòng nhập mật khẩu mới.'
    }

    if (password.length < 8) {
        return 'Mật khẩu phải có ít nhất 8 ký tự.'
    }

    if (!passwordRegex.test(password)) {
        return 'Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
    }

    return ''
}

export function validateConfirmPassword(
    password: string,
    confirmPassword: string
) {
    if (!confirmPassword) {
        return 'Vui lòng xác nhận mật khẩu mới.'
    }

    if (confirmPassword !== password) {
        return 'Mật khẩu xác nhận không khớp.'
    }

    return ''
}