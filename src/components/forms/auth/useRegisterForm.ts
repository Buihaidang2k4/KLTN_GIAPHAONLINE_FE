import { useRegisterMutation } from "@/hooks/query/auth/useRegisterMutation";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { RegisterReq } from "@/types/auth/auth";

export function useRegisterForm() {
    const router = useRouter();
    const { register, isRegistering } = useRegisterMutation();

    const registerForm = ref<RegisterReq>({
        fullName: "",
        email: "",
        phoneNumber: "",
        familyName: "",
        password: "",
        confirmPassword: "",
    });

    const errors = ref({
        fullName: "",
        email: "",
        phoneNumber: "",
        familyName: "",
        password: "",
        confirmPassword: "",
    });

    const clearErrors = () => {
        errors.value = {
            fullName: "",
            email: "",
            phoneNumber: "",
            familyName: "",
            password: "",
            confirmPassword: "",
        };
    };

    const validate = (): boolean => {
        clearErrors();
        let isValid = true;

        const fullName = registerForm.value.fullName.trim();
        const email = registerForm.value.email.trim();
        const phoneNumber = registerForm.value.phoneNumber.trim();
        const familyName = registerForm.value.familyName.trim();
        const password = registerForm.value.password;
        const confirmPassword = registerForm.value.confirmPassword;

        if (!fullName) {
            errors.value.fullName = "Vui lòng nhập họ tên";
            isValid = false;
        } else if (fullName.length < 5) {
            errors.value.fullName = "Họ tên phải có ít nhất 5 ký tự";
            isValid = false;
        }

        if (!email) {
            errors.value.email = "Vui lòng nhập email";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.value.email = "Email không hợp lệ";
            isValid = false;
        }

        if (!phoneNumber) {
            errors.value.phoneNumber = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!/^\d{10,13}$/.test(phoneNumber)) {
            errors.value.phoneNumber = "Số điện thoại không hợp lệ (10-13 chữ số)";
            isValid = false;
        }

        if (!familyName) {
            errors.value.familyName = "Vui lòng nhập tên gia đình";
            isValid = false;
        } else if (familyName.length < 2) {
            errors.value.familyName = "Tên gia đình phải có ít nhất 2 ký tự";
            isValid = false;
        }

        if (!password) {
            errors.value.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (password.length < 6) {
            errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        if (!confirmPassword) {
            errors.value.confirmPassword = "Vui lòng nhập lại mật khẩu";
            isValid = false;
        } else if (password !== confirmPassword) {
            errors.value.confirmPassword = "Mật khẩu xác nhận không khớp";
            isValid = false;
        }

        return isValid;
    };

    const registerHandler = async () => {
        if (!validate()) return;

        try {
            await register({
                ...registerForm.value,
                fullName: registerForm.value.fullName.trim(),
                email: registerForm.value.email.trim(),
                phoneNumber: registerForm.value.phoneNumber.trim(),
                familyName: registerForm.value.familyName.trim(),
            });

            router.push("/login");
        } catch (error) {
            console.error("Register failed:", error);
        }
    };

    return {
        registerForm,
        errors,
        validate,
        registerHandler,
        isRegistering,
    };
}