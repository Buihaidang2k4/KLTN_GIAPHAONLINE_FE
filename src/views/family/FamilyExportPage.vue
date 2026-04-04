<script setup lang="ts">
import FamilyTreePreview from "@/components/family_tree/TreeChartPreview.vue";
import { ref } from "vue";

const familyNodes = [
    { id: "1", pids: ["2"], generation: "1", name: "Nguyễn Văn Tâm", title: "1940", gender: "male", photo: "https://cdn.balkan.app/shared/m60/1.jpg" },
    { id: "2", pids: ["1"], generation: "1", name: "Lê Thị Thanh", title: "1945", gender: "female", photo: "https://cdn.balkan.app/shared/w60/1.jpg" },
    { id: "3", fid: "1", mid: "2", name: "Nguyễn Quang", title: "1965", generation: "2", gender: "male", photo: "https://cdn.balkan.app/shared/m60/2.jpg" }
];


//  droppdown export gia pha 
const isExportMenuOpen = ref(false);

// const runExport = (type: string) => {
//     if (!family) return;

//     if (type === 'pdf') family.exportPDF({ filename: "Gia-pha.pdf" });
//     if (type === 'png') family.exportPNG({ filename: "Gia-pha.png" });
//     if (type === 'svg') family.exportSVG({ filename: "Gia-pha.svg" });

//     isExportMenuOpen.value = false;
// };

</script>

<template>
    <div>
        <FamilyTreePreview :nodes="familyNodes" :roots="['1']" />
    </div>
</template>

<style scoped></style>