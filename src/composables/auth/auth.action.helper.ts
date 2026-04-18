
import { computed } from "vue";
import { useProfileQuery } from "@/hooks/query/auth/useProfileQuery";
import { hasPermission } from "@/composables/auth/auth.permission.helper";

const { user } = useProfileQuery();

const canExport = computed(() => hasPermission(user.value, "FAM_EXPORT"));
const canEditSettings = computed(() => hasPermission(user.value, "FAM_SETTINGS_EDIT"));
const canManagePosts = computed(() => hasPermission(user.value, "POST_MANAGE"));


// <RouterLink v -if= "canExport" to = "/family/xuat-file" > Xuất file </RouterLink>
//     < RouterLink v -if= "canEditSettings" to = "/family/cau-hinh" > Cấu hình </>
//         < RouterLink v -if= "canManagePosts" to = "/family/bai-viet" > Bài viết </>