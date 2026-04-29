import { useRegisterMutation } from "@/hooks/queries/auth/useRegisterMutation";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { RegisterReq } from "@/types/auth/auth.types";

const REGISTER_FORM_STORAGE_KEY = "register_form_draft";

export function useRegisterForm() {
    const router = useRouter();
    const { registerAsync, isRegistering } = useRegisterMutation();

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

    onMounted(() => {
        const savedData = localStorage.getItem(REGISTER_FORM_STORAGE_KEY);

        if (savedData) {
            const parsed = JSON.parse(savedData);

            registerForm.value.fullName = parsed.fullName || "";
            registerForm.value.email = parsed.email || "";
            registerForm.value.phoneNumber = parsed.phoneNumber || "";
            registerForm.value.familyName = parsed.familyName || "";
        }
    });

    watch(
        registerForm,
        (newValue) => {
            localStorage.setItem(
                REGISTER_FORM_STORAGE_KEY,
                JSON.stringify({
                    fullName: newValue.fullName,
                    email: newValue.email,
                    phoneNumber: newValue.phoneNumber,
                    familyName: newValue.familyName,
                })
            );
        },
        { deep: true }
    );

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
        }
        if (!validatePhoneNumber(phoneNumber)) {
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

    const normalizePhoneNumber = (phone: string): string => {
        return phone.replace(/[\s.-]/g, "");
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const normalizedPhone = normalizePhoneNumber(phone);

        const phoneRegex = /^(0|\+84|84)(3|5|7|8|9)\d{8}$/;

        if (!normalizedPhone) {
            errors.value.phoneNumber = "Vui lòng nhập số điện thoại";
            return false;
        }

        if (!phoneRegex.test(normalizedPhone)) {
            errors.value.phoneNumber =
                "Số điện thoại không hợp lệ. Ví dụ: 0912345678 hoặc +84912345678";
            return false;
        }

        return true;
    };

    const registerHandler = async () => {
        if (!validate()) return;

        const normalizedPhoneNumber = normalizePhoneNumber(registerForm.value.phoneNumber.trim());

        try {
            const result = await registerAsync({
                ...registerForm.value,
                fullName: registerForm.value.fullName.trim(),
                email: registerForm.value.email.trim(),
                phoneNumber: normalizedPhoneNumber,
                familyName: registerForm.value.familyName.trim(),
            });

            localStorage.removeItem(REGISTER_FORM_STORAGE_KEY);

            router.push({
                path: `/verify-account`,
                query: { email: result.data?.email.trim() }
            });

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