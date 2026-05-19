<script setup>
import { ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'

i18nChangeLanguage('en')

const props = defineProps({
    modelValue: { type: String, default: '<p><br></p>' },
    readOnly: { type: Boolean, default: false },
    placeholder: {
        type: String,
        default: 'Bắt đầu soạn hướng dẫn... Dùng Heading để tạo mục, ảnh screenshot để minh họa từng bước.',
    },
    uploadImageUrl: { type: String, default: '/api/upload-image' },
    uploadHeaders: { type: Object, default: () => ({}) },
    uploadMeta: { type: Object, default: () => ({}) },
    maxLength: { type: Number, default: 50000 },
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'imageUploaded', 'uploadError'])

const editorRef = shallowRef()
const valueHtml = ref(props.modelValue)
const charCount = ref(0)

watch(() => props.modelValue, (val) => {
    if (val !== valueHtml.value) valueHtml.value = val || '<p><br></p>'
})

watch(() => props.readOnly, (val) => {
    if (val) editorRef.value?.disable()
    else editorRef.value?.enable()
})

// ✅ Toolbar tối ưu cho Tutorial - chỉ giữ những gì thực sự dùng
const toolbarConfig = {
    toolbarKeys: [
        // Heading & text style
        'headerSelect',       // H1/H2/H3 dropdown
        'fontSize',
        '|',
        'bold', 'italic', 'underline', 'through', 'code', // inline code quan trọng
        '|',
        'color', 'bgColor',
        '|',
        // Cấu trúc nội dung
        'bulletedList',       // danh sách không thứ tự
        'numberedList',       // danh sách có thứ tự - QUAN TRỌNG cho bước hướng dẫn
        'todo',               // checkbox (done/undone steps)
        '|',
        // Insert
        'insertImage',        // ảnh screenshot
        'codeBlock',          // code block với syntax highlight
        'blockquote',         // callout/note
        'insertTable',        // bảng so sánh
        'divider',            // đường kẻ ngang phân section
        '|',
        // Format
        'indent', 'delIndent',
        'justifyLeft', 'justifyCenter',
        '|',
        'insertLink',         // link tài liệu tham khảo
        'undo', 'redo',
        'clearStyle',
        'fullScreen',
    ]
}

const editorConfig = {
    placeholder: props.placeholder,
    readOnly: props.readOnly,
    autoFocus: false,
    scroll: true,
    maxLength: props.maxLength,

    // ✅ Hover bar khi bôi chọn text - tối ưu cho tutorial
    hoverbarKeys: {
        text: {
            menuKeys: [
                'bold', 'italic', 'code',   // inline code rất hay dùng khi viết tutorial
                '|',
                'color', 'bgColor',
                '|',
                'insertLink', 'clearStyle',
            ],
        },
        image: {
            menuKeys: [
                'imageWidth30', 'imageWidth50', 'imageWidth100', // resize ảnh
                '|',
                'justifyLeft', 'justifyCenter', 'justifyRight',  // căn ảnh
                '|',
                'imageAlt', 'imageSrc',   // alt text (quan trọng cho SEO)
                '|',
                'deleteElement',
            ],
        },
        link: {
            menuKeys: ['editLink', 'unLink', 'viewLink'],
        },
    },

    MENU_CONF: {
        fontSize: {
            fontSizeList: ['13px', '14px', '15px', '16px', '18px', '20px', '24px', '28px'],
        },

        // ✅ Color palette phù hợp documentation
        color: {
            colors: [
                '#1e293b', '#334155', '#64748b',      // text màu slate
                '#dc2626', '#ea580c', '#d97706',       // warning/caution
                '#16a34a', '#0284c7', '#7c3aed',       // success/info/highlight
            ],
        },
        bgColor: {
            colors: [
                '#fef9c3', '#fef3c7', '#dbeafe',       // highlight vàng/xanh
                '#dcfce7', '#fee2e2', '#f3e8ff',       // green/red/purple
                '#f1f5f9',                              // slate nhạt
            ],
        },

        // ✅ Code block - quan trọng cho tutorial phần mềm
        codeSelectLang: {
            codeLangs: [
                { text: 'Plain Text', value: 'plain' },
                { text: 'HTML', value: 'html' },
                { text: 'CSS', value: 'css' },
                { text: 'JavaScript', value: 'javascript' },
                { text: 'TypeScript', value: 'typescript' },
                { text: 'JSON', value: 'json' },
                { text: 'SQL', value: 'sql' },
                { text: 'Bash / Shell', value: 'bash' },
                { text: 'Python', value: 'python' },
                { text: 'PHP', value: 'php' },
            ],
        },

        // ✅ Upload ảnh screenshot - config kỹ
        uploadImage: {
            server: props.uploadImageUrl,
            fieldName: 'file',
            maxFileSize: 8 * 1024 * 1024,      // 8MB cho screenshot độ phân giải cao
            maxNumberOfFiles: 20,
            allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            headers: props.uploadHeaders,
            meta: props.uploadMeta,
            base64LimitSize: 10 * 1024,         // ảnh nhỏ dưới 10KB thì dùng base64 luôn
            timeout: 20000,

            // Callback khi upload thành công
            onSuccess(file, res) {
                emit('imageUploaded', { file, res })
            },
            // Callback khi lỗi
            onError(file, err, res) {
                console.error('[Editor] Upload ảnh thất bại:', file.name, err)
                emit('uploadError', { file, err, res })
            },
            // Nếu API trả cấu trúc riêng thì map ở đây
            customInsert(res, insertFn) {
                const url = res?.data?.url || res?.url
                const alt = res?.data?.name || ''
                if (url) insertFn(url, alt, url)
                else console.error('[Editor] Không tìm thấy URL ảnh trong response:', res)
            },
        },
    },
}

function handleCreated(editor) {
    editorRef.value = editor
}

function handleChange(editor) {
    const html = editor.getHtml()
    valueHtml.value = html
    charCount.value = editor.getText().length
    emit('update:modelValue', html)
    emit('change', html)
}

onBeforeUnmount(() => {
    editorRef.value?.destroy()
})

defineExpose({
    getEditor: () => editorRef.value,
    getHtml: () => valueHtml.value,
    getText: () => editorRef.value?.getText() || '',
    setHtml: (html) => {
        const safe = html || '<p><br></p>'
        editorRef.value ? editorRef.value.setHtml(safe) : (valueHtml.value = safe)
    },
    clear: () => {
        editorRef.value ? editorRef.value.clear() : (valueHtml.value = '<p><br></p>')
    },
    focus: () => editorRef.value?.focus(),
    blur: () => editorRef.value?.blur(),
    insertImage: (url, alt = '') => {
        editorRef.value?.dangerouslyInsertHtml(`<img src="${url}" alt="${alt}"/>`)
    },
})
</script>

<template>
    <div class="editor-wrapper">
        <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />

        <Editor style="min-height: 600px; max-height: 900px; overflow-y: auto;" v-model="valueHtml"
            :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" @onChange="handleChange"
            @onFocus="() => emit('focus')" @onBlur="() => emit('blur')" />

        <!-- Status bar -->
        <div class="status-bar">
            <div class="flex gap-4 items-center">
                <span>📝 Bài viết hướng dẫn</span>
                <span>{{ charCount.toLocaleString() }} / {{ maxLength.toLocaleString() }} ký tự</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Sẵn sàng</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.editor-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.editor-wrapper:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.toolbar {
    border-bottom: 1px solid #f1f5f9;
    background: #f8fafc;
    padding: 4px 8px;
}

.status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 16px;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
}

/* ── Nội dung editor ── */
:deep(.w-e-text-container) {
    background: #fff !important;
}

:deep(.w-e-scroll) {
    padding: 24px 32px;
}

:deep(.w-e-text-container [data-slate-editor]) {
    font-size: 15px;
    line-height: 1.75;
    color: #1e293b;
}

/* Heading với anchor style */
:deep(.w-e-text-container h1) {
    font-size: 1.875rem;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.4em;
    margin: 1.5em 0 0.6em;
}

:deep(.w-e-text-container h2) {
    font-size: 1.375rem;
    font-weight: 700;
    color: #1e293b;
    border-left: 4px solid #6366f1;
    padding-left: 12px;
    margin: 1.4em 0 0.5em;
}

:deep(.w-e-text-container h3) {
    font-size: 1.1rem;
    font-weight: 600;
    color: #334155;
    margin: 1.2em 0 0.4em;
}

/* Blockquote = Note/Tip box */
:deep(.w-e-text-container blockquote) {
    border-left: 4px solid #6366f1;
    background: #eef2ff;
    padding: 12px 20px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
    color: #3730a3;
    font-style: normal;
}

/* Inline code */
:deep(.w-e-text-container code) {
    background: #f1f5f9;
    color: #dc2626;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.875em;
}

/* Code block */
:deep(.w-e-text-container pre) {
    background: #1e293b !important;
    color: #e2e8f0;
    padding: 16px 20px;
    border-radius: 8px;
    margin: 16px 0;
    overflow-x: auto;
    font-size: 0.875em;
    line-height: 1.6;
}

:deep(.w-e-text-container pre code) {
    background: transparent;
    color: inherit;
    padding: 0;
}

/* Numbered list - quan trọng nhất cho tutorial */
:deep(.w-e-text-container ol) {
    padding-left: 1.5em;
    counter-reset: step-counter;
}

:deep(.w-e-text-container ol li) {
    margin: 8px 0;
    padding-left: 4px;
    line-height: 1.7;
}

/* Ảnh */
:deep(.w-e-text-container img) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 12px 0;
    max-width: 100%;
    border: 1px solid #e2e8f0;
}

/* Table */
:deep(.w-e-text-container table) {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
}

:deep(.w-e-text-container table th) {
    background: #f8fafc;
    font-weight: 600;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
}

:deep(.w-e-text-container table td) {
    padding: 9px 14px;
    border: 1px solid #e2e8f0;
}

:deep(.w-e-text-container table tr:hover td) {
    background: #f8fafc;
}

/* Divider */
:deep(.w-e-text-container hr) {
    border: none;
    border-top: 2px dashed #e2e8f0;
    margin: 24px 0;
}
</style>