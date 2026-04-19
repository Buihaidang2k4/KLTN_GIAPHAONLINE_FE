
import { computed } from "vue";
import { useProfileQuery } from "@/hooks/query/auth/useProfileQuery";
import { hasPermission } from "@/composables/auth/auth.permission.helper";

const { user } = useProfileQuery();



export const isAdmin = computed(() => )
export const canExport = computed(() => hasPermission(user.value, "FAM_EXPORT"));
export const canEditSettings = computed(() => hasPermission(user.value, "FAM_SETTINGS_EDIT"));
export const canManagePosts = computed(() => hasPermission(user.value, "POST_MANAGE"));


// <RouterLink v -if= "canExport" to = "/family/xuat-file" > Xuất file </RouterLink>
//     < RouterLink v -if= "canEditSettings" to = "/family/cau-hinh" > Cấu hình </>
//         < RouterLink v -if= "canManagePosts" to = "/family/bai-viet" > Bài viết </>