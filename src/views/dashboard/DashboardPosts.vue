<script setup>
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'

// Chuyển ngôn ngữ sang tiếng Việt cho thân thiện
i18nChangeLanguage('en') // wangEditor hỗ trợ en/zh-CN, chúng ta dùng en làm base

const props = defineProps({
  modelValue: {
    type: String,
    default: '<p><br></p>',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Bắt đầu viết nội dung gia phả hoặc tin tức tại đây...',
  },
  uploadImageUrl: {
    type: String,
    default: '/api/upload-image',
  },
  uploadVideoUrl: {
    type: String,
    default: '/api/upload-video',
  },
  uploadHeaders: {
    type: Object,
    default: () => ({}),
  },
  uploadMeta: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'update:modelValue',
  'change',
  'focus',
  'blur',
])

const editorRef = shallowRef()
const valueHtml = ref(props.modelValue)

// Theo dõi thay đổi từ bên ngoài
watch(() => props.modelValue, (val) => {
  if (val !== valueHtml.value) valueHtml.value = val || '<p><br></p>'
})

// Cấu hình Toolbar (Thanh công cụ)
const toolbarConfig = {
  excludeKeys: [],
  insertKeys: {
    index: 5,
    keys: ['fontSize', 'fontFamily', 'lineHeight']
  }
}

// Cấu hình Editor (Trình soạn thảo)
const editorConfig = {
  placeholder: props.placeholder,
  readOnly: props.readOnly,
  autoFocus: false,
  scroll: true,

  // Cấu hình Menu chi tiết
  MENU_CONF: {
    fontFamily: {
      fontFamilyList: [
        'Inter', 'Arial', 'Tahoma', 'Verdana',
        { text: 'Times New Roman', value: 'Times New Roman' },
        { text: 'Garamond', value: 'Garamond' },
        'Courier New', 'Microsoft YaHei'
      ],
    },
    fontSize: {
      fontSizeList: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px'],
    },
    lineHeight: {
      lineHeightList: ['1', '1.2', '1.5', '2', '2.5'],
    },
    color: {
      colors: ['#000000', '#333333', '#666666', '#999999', '#d4a017', '#b45309', '#be123c', '#1d4ed8'],
    },

    // Cấu hình Upload Ảnh
    uploadImage: {
      server: props.uploadImageUrl,
      fieldName: 'file',
      maxFileSize: 5 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*'],
      timeout: 15000,
      headers: props.uploadHeaders,
      meta: props.uploadMeta,
      base64LimitSize: 5 * 1024,
    },

    // Cấu hình Video
    uploadVideo: {
      server: props.uploadVideoUrl,
      fieldName: 'file',
      maxFileSize: 50 * 1024 * 1024,
      timeout: 30000,
      headers: props.uploadHeaders,
      meta: props.uploadMeta,
    },

    codeSelectLang: {
      codeLangs: [
        { text: 'HTML', value: 'html' },
        { text: 'Java', value: 'java' },
        { text: 'Javascript', value: 'javascript' },
        { text: 'SQL', value: 'sql' },
      ],
    },
  },
}

// Event handlers
function handleCreated(editor) {
  editorRef.value = editor
}

function handleChange(editor) {
  const html = editor.getHtml()
  valueHtml.value = html
  emit('update:modelValue', html)
  emit('change', html)
}

// Cleanup khi component bị hủy
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// Methods expose ra ngoài (Cần thiết cho component cha gọi ref)
defineExpose({
  getEditor: () => editorRef.value,
  getHtml: () => valueHtml.value,
  getText: () => editorRef.value?.getText() || '',
  getJson: () => editorRef.value?.children || [],
  setHtml: (html) => {
    const safeHtml = html || '<p><br></p>'
    if (editorRef.value) editorRef.value.setHtml(safeHtml)
    else valueHtml.value = safeHtml
  },
  clear: () => {
    if (editorRef.value) editorRef.value.clear()
    else valueHtml.value = '<p><br></p>'
  }
})
</script>

<template>
  <div class="editor-wrapper shadow-sm border border-slate-200 rounded-2xl overflow-hidden bg-white flex flex-col">
    <Toolbar class="border-b border-slate-100 bg-slate-50/50" :editor="editorRef" :defaultConfig="toolbarConfig"
      mode="default" />

    <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
      @onCreated="handleCreated" @onChange="handleChange" />

    <div
      class="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
      <div class="flex gap-4">
        <span>Trình soạn thảo nội dung chuyên sâu</span>
        <span v-if="editorRef">Ký tự: {{ editorRef.getText().length }}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        Sẵn sàng
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-wrapper {
  transition: all 0.3s ease;
}

.editor-wrapper:focus-within {
  border-color: #f59e0b;
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.1);
}

:deep(.w-e-toolbar) {
  padding: 4px;
  background-color: transparent !important;
}

:deep(.w-e-toolbar-item) {
  border-radius: 6px;
  margin: 1px;
}

:deep(.w-e-toolbar-item:hover) {
  background-color: #fffbeb !important;
}

:deep(.w-e-text-container) {
  background-color: #fff !important;
}

:deep(.w-e-text-placeholder) {
  font-style: italic;
  top: 20px;
  left: 20px;
}

:deep(.w-e-scroll) {
  padding: 10px 20px;
}

:deep(.w-e-text-container [data-slate-editor]) {
  line-height: 1.6;
  font-size: 15px;
  color: #334155;
}

:deep(.w-e-text-container h1) {
  font-size: 2em;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5em;
}

:deep(.w-e-text-container h2) {
  font-size: 1.5em;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.4em;
}

:deep(.w-e-text-container blockquote) {
  border-left: 4px solid #f59e0b;
  padding-left: 1em;
  color: #64748b;
  font-style: italic;
  background: #fffbeb;
  padding: 10px 20px;
  margin: 1em 0;
}

:deep(.w-e-text-container table) {
  border-collapse: collapse;
  margin: 10px 0;
  width: 100%;
}

:deep(.w-e-text-container table td),
:deep(.w-e-text-container table th) {
  border: 1px solid #e2e8f0;
  padding: 8px;
  min-width: 50px;
}

:deep(.w-e-text-container table th) {
  background-color: #f8fafc;
  font-weight: bold;
}
</style>