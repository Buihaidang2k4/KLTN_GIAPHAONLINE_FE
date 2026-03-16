<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import FamilyTree from "@balkangraph/familytree.js";

type FamilyNode = {
    id: string | number;
    fid?: string | number;
    mid?: string | number;
    pids?: Array<string | number>;
    name: string;
    title?: string;
    gender?: "male" | "female";
    photo?: string;
    generation?: string | number;
    tags?: string[];
};

const props = defineProps<{
    nodes: FamilyNode[];
    roots?: Array<string | number>;
}>();

const treeRef = ref<HTMLDivElement | null>(null);
let family: any = null;

const normalizeNodes = (nodes: FamilyNode[]) => {
    return nodes.map((node) => {
        const tags = node.tags?.length
            ? node.tags
            : node.gender === "female"
                ? ["NU"]
                : ["NAM"];

        return {
            ...node,
            tags,
        };
    });
};

const initTemplates = () => {
    // Template nam
    FamilyTree.templates.simpleMale = Object.assign({}, FamilyTree.templates.base);
    FamilyTree.templates.simpleMale.size = [160, 170];
    FamilyTree.templates.simpleMale.node = `
    <rect x="0" y="0" height="170" width="160" fill="#F2F6FB" stroke-width="1.5" stroke="#4A6FA5" rx="10" ry="10"></rect>
  `;

    FamilyTree.templates.simpleMale.field_gen = `
    <g transform="translate(10, 10)">
      <circle cx="12" cy="12" r="10" fill="#4A6FA5" opacity="0.12"></circle>
      <text fill="#4A6FA5" x="12" y="16" text-anchor="middle" style="font-size: 12px; font-weight: bold;">{val}</text>
    </g>
  `;

    FamilyTree.templates.simpleMale.clip_0 = `
    <clipPath id="simpleMaleClip">
      <circle cx="80" cy="45" r="35"></circle>
    </clipPath>
  `;

    FamilyTree.templates.simpleMale.circle_0 = `
    <circle cx="80" cy="45" r="40" fill="none" stroke="#4A6FA5" stroke-width="3"></circle>
  `;

    FamilyTree.templates.simpleMale.img_0 = `
    <image preserveAspectRatio="xMidYMid slice" clip-path="url(#simpleMaleClip)" x="45" y="10" width="70" height="70" xlink:href="{val}"></image>
  `;

    FamilyTree.templates.simpleMale.field_0 = `
    <text style="font-size: 17px; font-weight: 700; font-family: serif;" fill="Black" x="80" y="120" text-anchor="middle">{val}</text>
  `;

    FamilyTree.templates.simpleMale.field_1 = `
    <text style="font-size: 14px; font-style: italic; font-family: serif;" fill="Black" x="80" y="145" text-anchor="middle">{val}</text>
  `;

    // Template nữ
    FamilyTree.templates.simpleFemale = Object.assign({}, FamilyTree.templates.simpleMale);
    FamilyTree.templates.simpleFemale.node = `
    <rect x="0" y="0" height="170" width="160" fill="#FAF3F1" stroke-width="1.5" stroke="#B07A6A" rx="10" ry="10"></rect>
  `;
    FamilyTree.templates.simpleFemale.circle_0 = `
    <circle cx="80" cy="45" r="40" fill="none" stroke="#F472B6" stroke-width="3"></circle>
  `;

    // nút đóng/mở nhánh
    FamilyTree.templates.simpleMale.plus = `
    <circle cx="80" cy="0" r="15" fill="#ffffff" stroke="#B71C1C" stroke-width="1"></circle>
    <line x1="75" y1="0" x2="85" y2="0" stroke-width="1" stroke="#B71C1C"></line>
    <line x1="80" y1="-5" x2="80" y2="5" stroke-width="1" stroke="#B71C1C"></line>
  `;
    FamilyTree.templates.simpleFemale.plus = FamilyTree.templates.simpleMale.plus;
};

const renderTree = () => {
    if (!treeRef.value) return;

    if (family) {
        family.destroy();
        family = null;
    }

    initTemplates();

    family = new FamilyTree(treeRef.value, {
        template: "simpleMale",
        mouseScrool: FamilyTree.action.zoom,
        roots: props.roots?.length ? props.roots : [1],
        layout: "mixed",
        orientation: FamilyTree.orientation.top,
        align: FamilyTree.align.center,

        nodeBinding: {
            field_0: "name",
            field_1: "title",
            field_gen: "generation",
            img_0: "photo",
        },

        tags: {
            NAM: { template: "simpleMale" },
            NU: { template: "simpleFemale" },
        },

        siblingSeparation: 80,
        levelSeparation: 150,
        subtreeSeparation: 100,
        partnerChildrenSplitSeparation: 80,
        padding: 100,

        scaleInitial: 1,
        scaleMax: 5,
        enableSearch: false,
        nodeMenu: false,
        nodeMenuButton: null,
        nodeMenuTrigger: null,
        nodeCircleMenu: false,
        editForm: false,
        showLevelLines: true,
        expandAll: true,
    } as any);

    family.load(normalizeNodes(props.nodes));
    family.draw();
};

onMounted(() => {
    renderTree();
});

watch(
    () => props.nodes,
    () => {
        renderTree();
    },
    { deep: true }
);

watch(
    () => props.roots,
    () => {
        renderTree();
    },
    { deep: true }
);

onBeforeUnmount(() => {
    if (family) {
        family.destroy();
        family = null;
    }
});
</script>

<template>
    <div class="family-tree-wrapper">
        <div ref="treeRef" class="family-tree"></div>
    </div>
</template>

<style scoped>
.family-tree-wrapper {
    width: 100%;
    height: 100%;
    min-height: 700px;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
}

.family-tree {
    width: 100%;
    height: 100%;
}

:deep(.menu-button),
:deep([data-ctrl-n-menu-id]),
:deep([data-ctrl-n-menu]),
:deep([data-ctrl-menu]),
:deep(.bft-control-container),
:deep(.bft-search) {
    display: none !important;
}

/* Style đường nối */
:deep(.bft-link path),
:deep(.link path),
:deep(g[data-link] path) {
    stroke: #6a6a6a !important;
    stroke-width: 3px !important;
}
</style>