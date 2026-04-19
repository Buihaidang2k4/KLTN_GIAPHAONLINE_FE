import { useLoginMutation } from "@/hooks/queries/auth/useLoginMutation";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

export function useLoginForm() {
    const router = useRouter();
    const { loginAsync, isLoggingIn } = useLoginMutation();

    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);

    const errors = ref({
        email: "",
        password: "",
    });

    const clearErrors = () => {
        errors.value.email = "";
        errors.value.password = "";
    }

    const validate = () => {
        clearErrors();

        let isValid = true;

        if (!email.value.trim()) {
            errors.value.email = 'Vui lòng nhập email';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            errors.value.email = 'Email không hợp lệ';
            isValid = false;
        }

        if (!password.value.trim()) {
            errors.value.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        }

        return isValid;
    }

    const submit = async () => {
        if (!validate()) return;

        await loginAsync({
            email: email.value.trim(),
            password: password.value,
        })

        router.push("/family");
    }

    const isSubmitDisabled = computed(() => {
        return isLoggingIn.value;
    });

    return {
        email,
        password,
        showPassword,
        errors,
        submit,
        isLoggingIn,
        isSubmitDisabled,
    };

}