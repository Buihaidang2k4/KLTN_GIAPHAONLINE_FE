<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";
import FamilyTree from "@balkangraph/familytree.js";
import bg_familytree from "@/assets/images/bg_familyTree.jpg";
import { notify } from "@/utils/notify";
import { useFamilyStore } from "@/store/family/useFamilyStore";
import AddSiblingsModal from "@/components/forms/family_tree/AddSiblingsModal.vue";
import HeaderFamilyTree from "@/components/family_tree/HeaderFamilyTree.vue";
import { useRoute } from "vue-router";
import {
  useAddChildMutation,
  useAddPartnerMutation,
  useAddRootMutation,
  useCreatePersonMutation,
  useDeletePersonMutation,
  useFamilyTreeQuery,
  useUpdatePersonMutation,
} from "@/hooks/queries/family/family_tree/useFamilyTree";
import male_default from "@/assets/tree/male_default.jpg";
import female_default from "@/assets/tree/female_default.jpg";
import { formatDate } from "@/utils/format-date";
import type { PersonReq } from "@/types/family/family_tree.types";
import AddChildrenModal from "@/components/forms/family_tree/AddChildrenModal.vue";
import AddFistPersonModal from "@/components/forms/family_tree/AddFistPersonModal.vue";
import AddPartnerModel from "@/components/forms/family_tree/AddPartnerModel.vue";
import EditPersonModal from "@/components/forms/family_tree/EditPersonModal.vue";
import { useFamilyPermissions } from "@/composables/family/useFamilyPermissions";
import { useFamilySubscriptionStore } from "@/store/family/useFamilySubscriptionStore";
import { batchImagesToBase64, imageToBase64 } from "@/utils/convert-img";

const iconMenu = {
  addSiblings:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  addPartner:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e91e63" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  addChildren:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  viewChildren:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="23 13 23 17 19 17"/><path d="M23 13l-4 4"/></svg>',
  rootFocus:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>',
  remove:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
};

const route = useRoute();
const bgImageStyle = computed(() => `url(${bg_familytree})`);

const treeRef = ref<HTMLDivElement | null>(null);
const selectedMember = ref<any>(null);
let family: any = null;
const isMiniMap = ref<boolean>(false);
const categoryId = computed(() => Number(route.query.categoryId));
const bgBase64 = ref<string>("");

// data
const {
  data: familyTreeData,
  refetch: refetchFamilyTree,
  isLoading: isLoadingFamilyTree,
} = useFamilyTreeQuery(categoryId);
const safeFamilyTrees = computed(() => familyTreeData.value?.data || []);

// Chuẩn hóa dữ liệu từ API về format FamilyTree
const processedFamilyData = computed(() => {
  return safeFamilyTrees.value.map((node: any) => {
    const defaultAvatar = node.gender === "male" ? male_default : female_default;
    return {
      id: node.id,
      fid: node.fid || null,
      mid: node.mid || null,
      pids: node.pids || [],
      childs: node.childs || [],
      generation: node.generation,
      personName: node.personName,
      phoneNumber: node.phoneNumber,
      biography: node.biography,
      lifeStatus: node.lifeStatus,
      originPlace: node.originPlace,
      placeOfResidence: node.placeOfResidence,
      isInFamily: node.isInFamily,
      deathDate: formatDate(node.deathDate),
      birthDate: formatDate(node.birthDate),
      avatar: node.avatarUrl || defaultAvatar,
      gender: node.gender,
      tags: node.gender === "male" ? ["NAM"] : ["NU"],
    };
  });
});

// ========== LOGIC XEM ĐỜI SAU (bao gồm cả vợ/chồng) ==========
const viewRootId = ref<number | null>(null);

// Lấy tất cả id cần hiển thị khi xem đời sau: gồm node gốc, con cháu, và tất cả partner (vợ/chồng) của các node đó
function getDisplayIdsForView(rootId: number, nodes: any[]): number[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const resultSet = new Set<number>();

  // Hàm thêm partner của một node (các node có pids chứa id này)
  function addPartners(id: number) {
    const partners = nodes.filter((n) => n.pids && n.pids.includes(id));
    partners.forEach((p) => resultSet.add(p.id));
  }

  // Duyệt cây con (theo childs) để lấy hậu duệ
  function traverseDescendants(id: number) {
    if (resultSet.has(id)) return;
    resultSet.add(id);
    addPartners(id); // thêm vợ/chồng của node hiện tại
    const node = nodeMap.get(id);
    if (node && node.childs && node.childs.length) {
      for (const childId of node.childs) {
        traverseDescendants(childId);
      }
    }
  }

  // Bắt đầu từ node gốc
  traverseDescendants(rootId);

  // Chuyển Set thành mảng
  return Array.from(resultSet);
}

// Dữ liệu hiển thị trên cây (có thể bị lọc theo chế độ xem đời sau)
const displayFamilyData = computed(() => {
  if (viewRootId.value === null) {
    return processedFamilyData.value;
  }
  const allowedIds = getDisplayIdsForView(viewRootId.value, processedFamilyData.value);
  return processedFamilyData.value.filter((node) => allowedIds.includes(node.id));
});

// Root toàn cục (dùng khi viewRootId = null)
const globalRootId = computed(() => {
  const noParentNodes = processedFamilyData.value.filter((node) => !node.fid && !node.mid);
  if (!noParentNodes.length) return null;
  const maleRoot = noParentNodes.find(
    (node) => node.gender === "male" && node.isInFamily === true
  );
  if (maleRoot) return maleRoot.id;
  const inFamilyRoot = noParentNodes.find((node) => node.isInFamily === true);
  if (inFamilyRoot) return inFamilyRoot.id;
  return noParentNodes[0].id;
});

// ==================== KHỞI TẠO FAMILY TREE ====================
onMounted(async () => {

  // ─── THÊM: Convert ảnh nền sang base64 ───
  bgBase64.value = await imageToBase64(bg_familytree);

  // Đảm bảo DOM đã render xong 
  await nextTick();
  setTimeout(() => {
    if (treeRef.value) {
      // ================= TEMPLATE NAM =================
      FamilyTree.templates.john = Object.assign({}, FamilyTree.templates.base);
      FamilyTree.templates.john.size = [172, 182];

      FamilyTree.templates.john.defs = `
      <filter id="nodeShadow" x="-12%" y="-12%" width="135%" height="135%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#3E2723" flood-opacity="0.13"/>
      </filter>
      <filter id="avatarSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.10"/>
      </filter>
      <linearGradient id="maleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFDF7"/>
        <stop offset="100%" stop-color="#F5EEDC"/>
      </linearGradient>
      <linearGradient id="femaleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFF9F2"/>
        <stop offset="100%" stop-color="#F4E6D8"/>
      </linearGradient>
      <clipPath id="johnAvatarClip" clipPathUnits="userSpaceOnUse">
        <rect x="46" y="25" width="80" height="80" rx="16" ry="16"></rect>
      </clipPath>
      <clipPath id="janeAvatarClip" clipPathUnits="userSpaceOnUse">
        <rect x="46" y="25" width="80" height="80" rx="16" ry="16"></rect>
      </clipPath>
      <style>
        .menu-button:hover .menu-bg { opacity: 0.2; }
      </style>
    `;

      FamilyTree.templates.john.node =
        '<rect x="0" y="0" height="182" width="172" fill="url(#maleGrad)" stroke-width="1.8" stroke="#B89554" rx="8" ry="8" filter="url(#nodeShadow)"></rect>' +
        '<g class="menu-button" style="cursor:pointer; pointer-events:all;" transform="translate(136, 13)" data-ctrl-n-menu-id="{id}">' +
        '<circle class="menu-bg" cx="12" cy="12" r="12" fill="#B89554" opacity="0.14"/>' +
        '<path fill="#6B5A3A" d="M12 7.6c.32 0 .63.03.93.1l.42-1.08c.07-.18.27-.28.45-.2l1.05.44c.18.08.27.28.2.46l-.46 1.05c.48.33.9.75 1.23 1.23l1.05-.46c.18-.08.39 0 .46.2l.44 1.05c.08.18-.02.39-.2.45l-1.08.42c.06.3.1.61.1.93s-.04.63-.1.93l1.08.42c.18.07.28.27.2.45l-.44 1.05c-.07.18-.28.27-.46.2l-1.05-.46c-.33.48-.75.9-1.23 1.23l.46 1.05c.08.18 0 .39-.2.46l-1.05.44c-.18.08-.39-.02-.45-.2l-.42-1.08c-.3.06-.61.1-.93.1s-.63-.04-.93-.1l-.42 1.08c-.07.18-.27.28-.45.2l-1.05-.44c-.18-.07-.27-.28-.2-.46l.46-1.05c-.48-.33-.9-.75-1.23-1.23l-1.05.46c-.18.08-.39 0-.46-.2l-.44-1.05c-.08-.18.02-.39.2-.45l1.08-.42c-.06-.3-.1-.61-.1-.93s.04-.63.1-.93l-1.08-.42c-.18-.07-.28-.27-.2-.45l.44-1.05c.07-.18.28-.27.46-.2l1.05.46c.33-.48.75-.9 1.23-1.23l-.46-1.05c-.08-.18 0-.39.2-.46l1.05-.44c.18-.08.39.02.45.2l.42 1.08c.3-.07.61-.1.93-.1Zm0 2.7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"/>' +
        '</g>';

      FamilyTree.templates.john.clip_0 = "";
      FamilyTree.templates.john.img_0 =
        '<g filter="url(#avatarSoftShadow)">' +
        '<rect x="41" y="20" width="90" height="90" rx="20" ry="20" fill="#FFFDF8" stroke="#E4D6BC" stroke-width="1.2"></rect>' +
        '<g clip-path="url(#johnAvatarClip)">' +
        '<image preserveAspectRatio="xMidYMid slice" x="46" y="25" width="80" height="80" xlink:href="{val}"></image>' +
        "</g>" +
        "</g>";
      FamilyTree.templates.john.circle_0 =
        '<rect x="45.5" y="24.5" width="81" height="81" rx="16" ry="16" fill="none" stroke="#CDBB98" stroke-width="1.5"></rect>';
      FamilyTree.templates.john.field_0 =
        '<text style="font-size:16px; font-weight:700; font-family:Georgia, serif;" fill="#3A2A20" x="86" y="141" text-anchor="middle" pointer-events="none">{val}</text>';
      FamilyTree.templates.john.field_1 =
        '<text style="font-size:13px; font-style:italic; font-family:Georgia, serif;" fill="#6E5A47" x="86" y="164" text-anchor="middle" pointer-events="none">{val}</text>';
      FamilyTree.templates.john.field_gen =
        '<g transform="translate(13, 13)">' +
        '<circle cx="12" cy="12" r="11" fill="#B89554" opacity="0.18"/>' +
        '<text fill="#6B5A3A" x="12" y="16" text-anchor="middle" style="font-size:11px; font-weight:bold;">{val}</text>' +
        "</g>";
      FamilyTree.templates.john.nodeMenuButton =
        '<g style="cursor:pointer;" transform="matrix(1,0,0,1,136,13)" data-ctrl-n-menu-id="{id}">' +
        '<rect x="0" y="0" fill="transparent" width="24" height="24"></rect>' +
        "</g>";

      // ================= TEMPLATE NỮ =================
      FamilyTree.templates.jane = Object.assign({}, FamilyTree.templates.john);
      FamilyTree.templates.jane.node =
        '<rect x="0" y="0" height="182" width="172" fill="url(#femaleGrad)" stroke-width="1.8" stroke="#B97854" rx="8" ry="8" filter="url(#nodeShadow)"></rect>' +
        '<g class="menu-button" style="cursor:pointer; pointer-events:all;" transform="translate(136, 13)" data-ctrl-n-menu-id="{id}">' +
        '<circle class="menu-bg" cx="12" cy="12" r="12" fill="#B97854" opacity="0.14"/>' +
        '<path fill="#74513E" d="M12 7.6c.32 0 .63.03.93.1l.42-1.08c.07-.18.27-.28.45-.2l1.05.44c.18.08.27.28.2.46l-.46 1.05c.48.33.9.75 1.23 1.23l1.05-.46c.18-.08.39 0 .46.2l.44 1.05c.08.18-.02.39-.2.45l-1.08.42c.06.3.1.61.1.93s-.04.63-.1.93l1.08.42c.18.07.28.27.2.45l-.44 1.05c-.07.18-.28.27-.46.2l-1.05-.46c-.33.48-.75.9-1.23 1.23l.46 1.05c.08.18 0 .39-.2.46l-1.05.44c-.18.08-.39-.02-.45-.2l-.42-1.08c-.3.06-.61.1-.93.1s-.63-.04-.93-.1l-.42 1.08c-.07.18-.27.28-.45.2l-1.05-.44c-.18-.07-.27-.28-.2-.46l.46-1.05c-.48-.33-.9-.75-1.23-1.23l-1.05.46c-.18.08-.39 0-.46-.2l-.44-1.05c-.08-.18.02-.39.2-.45l1.08-.42c-.06-.3-.1-.61-.1-.93s.04-.63.1-.93l-1.08-.42c-.18-.07-.28-.27-.2-.45l.44-1.05c.07-.18.28-.27.46-.2l1.05.46c.33-.48.75-.9 1.23-1.23l-.46-1.05c-.08-.18 0-.39.2-.46l1.05-.44c.18-.08.39.02.45.2l.42 1.08c.3-.07.61-.1.93-.1Zm0 2.7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"/>' +
        "</g>";
      FamilyTree.templates.jane.clip_0 = "";
      FamilyTree.templates.jane.img_0 =
        '<g filter="url(#avatarSoftShadow)">' +
        '<rect x="41" y="20" width="90" height="90" rx="20" ry="20" fill="#FFF9F2" stroke="#E3CBB9" stroke-width="1.2"></rect>' +
        '<g clip-path="url(#janeAvatarClip)">' +
        '<image preserveAspectRatio="xMidYMid slice" x="46" y="25" width="80" height="80" xlink:href="{val}"></image>' +
        "</g>" +
        "</g>";
      FamilyTree.templates.jane.circle_0 =
        '<rect x="45.5" y="24.5" width="81" height="81" rx="16" ry="16" fill="none" stroke="#D1AD94" stroke-width="1.5"></rect>';
      FamilyTree.templates.jane.field_0 =
        '<text style="font-size:16px; font-weight:700; font-family:Georgia, serif;" fill="#3A2A20" x="86" y="141" text-anchor="middle" pointer-events="none">{val}</text>';
      FamilyTree.templates.jane.field_1 =
        '<text style="font-size:13px; font-style:italic; font-family:Georgia, serif;" fill="#715342" x="86" y="164" text-anchor="middle" pointer-events="none">{val}</text>';
      FamilyTree.templates.jane.field_gen =
        '<g transform="translate(13, 13)">' +
        '<circle cx="12" cy="12" r="11" fill="#B97854" opacity="0.18"/>' +
        '<text fill="#74513E" x="12" y="16" text-anchor="middle" style="font-size:11px; font-weight:bold;">{val}</text>' +
        "</g>";

      family = new FamilyTree(treeRef.value, {
        template: "john",
        nodeBinding: {
          field_0: "personName",
          field_1: "birthDate",
          field_gen: "generation",
          img_0: "avatar",
        },
        tags: {
          NAM: { template: "john" },
          NU: { template: "jane" },
        },
        nodeMenu: {
          addSiblings: {
            text: "Thêm đời đầu",
            icon: iconMenu.addSiblings,
            onClick: hanldeAddSiblingOpen,
          },
          addPartner: {
            text: "Thêm hôn thê",
            icon: iconMenu.addPartner,
            onClick: handleAddPatner,
          },
          addChildren: {
            text: "Thêm con",
            icon: iconMenu.addChildren,
            onClick: hanldeClickAddChilren,
          },
          viewChildren: {
            text: "Xem đời sau",
            icon: iconMenu.viewChildren,
            onClick: handleViewChildren,
          },
          rootFocus: {
            text: "Trở về gốc",
            icon: iconMenu.rootFocus,
            onClick: hanldeRootFocus,
          },
          editNode: {
            text: "Chỉnh sửa",
            icon: iconMenu.edit,
            onClick: handleEditNode,
          },
          removeNode: {
            text: "Xóa thành viên",
            icon: iconMenu.remove,
            onClick: hanldeRemoveNode,
          },
        },
        menu: {
          export_pdf: {
            text: "Xuất PDF",
            icon: FamilyTree.icon.pdf(24, 24, "#7A7A7A"),
            onClick: exportPdf,
          },
          export_png: {
            text: "Xuất PNG",
            icon: FamilyTree.icon.png(24, 24, "#7A7A7A"),
            onClick: exportPNG,
          },
          export_svg: {
            text: "Xuất SVG",
            icon: FamilyTree.icon.svg(24, 24, "#7A7A7A"),
            onClick: exportSVG,
          },
        },
        nodeMenuTrigger: (FamilyTree as any).action.nodeMenu,
        nodeMenuButton: ".menu-button",
        editForm: false,
        mouseScrool: (FamilyTree as any).action.zoom,
        layout: FamilyTree.layout.normal,
        siblingSeparation: 70,
        levelSeparation: 200,
        partnerChildrenSplitSeparation: 100,
        partnerNodeSeparation: 20,
        subtreeSeparation: 170,
        polygamy: true,
        enableSearch: true,
        showLevelLines: true,
        searchFields: ["personName"],
        searchDisplayField: "personName",
        searchFieldsHighlight: { stroke: "red", strokeWidth: 5 },
        searchFieldsWeight: { Name: 100 },
        align: FamilyTree.align.center,
        orientation: FamilyTree.orientation.top,
        padding: 100,
        scaleInitial: 1,
        scaleMax: 10,
        zoom: { speed: 130, smooth: 10 },
        expandAll: true,
        nodeCircleMenu: true,
        miniMap: isMiniMap.value,
      } as any);

      // config menu by permission
      family.nodeMenuUI.on("show", (_sender: any, args: any) => {
        const nodeId = args.firstNodeId ?? args.nodeId;
        const node = nodeId != null ? family.get(nodeId) : null;
        if (!node || !args.menu) return;
        const isMale = node.gender === "male" || (Array.isArray(node.tags) && node.tags.includes("NAM"));
        if (args.menu.addPartner) {
          args.menu.addPartner.text = isMale ? "Thêm hôn thê" : "Thêm hôn phu";
        }
      });


      // Nạp dữ liệu ban đầu
      family.load(displayFamilyData.value);
      family.draw();
    }
  }, 0);
});

// Theo dõi displayFamilyData để cập nhật cây khi dữ liệu thay đổi hoặc chế độ xem đời sau thay đổi
watch(
  displayFamilyData,
  (newData) => {
    if (!family || !newData.length) return;

    let roots: number[];
    if (viewRootId.value !== null) {
      roots = [viewRootId.value];
    } else {
      const noParentNodes = newData.filter((n: any) => !n.fid && !n.mid);
      const mainRoot =
        noParentNodes.find((n: any) => n.gender === "male" && n.isInFamily === true) ||
        noParentNodes.find((n: any) => n.isInFamily === true) ||
        noParentNodes[0];
      roots = mainRoot ? [mainRoot.id] : [newData[0].id];
    }

    family.config.roots = roots;
    family.load(newData);
  },
  { immediate: false }
);

// =========== check role ================
const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);
const { canWriteNode, canDeleteNode, withPermission } = useFamilyPermissions(familyId);
// check quota
const subStore = useFamilySubscriptionStore();

// ================== ACTION RootFocus ====================
const hanldeRootFocus = () => {
  if (!family) return;
  const targetId = viewRootId.value !== null ? viewRootId.value : globalRootId.value;
  if (targetId) {
    family.center(targetId, { ripple: true, zoomState: 1.5, slow: true });
  }
};

// =============== ACTION AddFirstNode =====================
const isModalAddFirstNodeOpen = ref<boolean>(false);
const isEmpty = computed(() => processedFamilyData.value.length === 0);
const createFirstPersonMutation = useCreatePersonMutation();

const handleAddFirstNodeOpen = withPermission(canWriteNode, () => {
  if (!subStore.guardAddPerson()) return;

  if (isEmpty.value) isModalAddFirstNodeOpen.value = true;
});

const onCreateRootPerson = async (formData: PersonReq) => {
  try {
    await createFirstPersonMutation.mutateAsync(
      { categoryId: categoryId.value, data: formData },
      {
        onSuccess: () => {
          isModalAddFirstNodeOpen.value = false;
          notify.success("Thông báo", "Tạo thành viên gốc thành công");
          refetchFamilyTree();
        },
        onError: () => {
          notify.error("Thông báo", "Tạo thành viên gốc không thành công");
        },
      }
    );
  } catch (error) {
    console.error("Tạo node gốc thất bại", error);
  }
};

// ================== ACTION AddSiblings ====================
const isModalAddSiblingOpen = ref<boolean>(false);
const addRootPersonMutation = useAddRootMutation();

const hanldeAddSiblingOpen = withPermission(canWriteNode, (nodeId: any) => {
  if (!subStore.guardAddPerson()) return;

  const rawData = family.get(nodeId);

  // check can add sibling
  const isRoot = rawData?.fid === null && rawData?.mid === null && rawData?.isInFamily === true;
  if (!isRoot) {
    notify.warning("Thông báo", "Chỉ thành viên gốc mới được thêm đời đầu !");
    return;
  }


  if (rawData) {
    console.log(rawData)
    selectedMember.value = structuredClone(rawData);
    isModalAddSiblingOpen.value = true;
  }
});

const onAddSiblingPerson = async (formData: PersonReq) => {
  try {
    await addRootPersonMutation.mutateAsync(
      { personId: selectedMember.value.id, data: formData },
      {
        onSuccess: () => {
          isModalAddSiblingOpen.value = false;
          notify.success("Thông báo", "Thêm đời đầu thành công");
          refetchFamilyTree();
        },
        onError: () => {
          notify.error("Thông báo", "Thêm đời đầu không thành công");
        },
      }
    );
  } catch (error) {
    console.error("Lỗi khi thêm đời đầu:", error);
  }
};

// ================== ACTION AddChildren ====================
const isModalAddChildrenOpen = ref<boolean>(false);
const createChildrenMutation = useAddChildMutation();

const hanldeClickAddChilren = withPermission(canWriteNode, (nodeId: any) => {
  if (!subStore.guardAddPerson()) return;

  const rawData = family.get(nodeId);
  if (rawData) {
    selectedMember.value = structuredClone(rawData);
    isModalAddChildrenOpen.value = true;
  }
});

const onAddChildPerson = (updatedData: any) => {
  if (family && updatedData) {
    try {
      createChildrenMutation.mutateAsync(
        { personId: selectedMember.value.id, data: updatedData },
        {
          onSuccess: () => {
            isModalAddChildrenOpen.value = false;
            selectedMember.value = null;
            notify.success("Thông báo", "Thêm thành viên con thành công");
            refetchFamilyTree();
          },
          onError: () => {
            isModalAddChildrenOpen.value = false;
            selectedMember.value = null;
            notify.error("Thông báo", "Thêm thành viên con không thành công");
          },
        }
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật node vào FamilyTree:", error);
    }
  }
};

// ================== ACTION AddPatner ====================
const isModelAddPartnerOpen = ref<boolean>(false);
const addPartnerMutation = useAddPartnerMutation();

const handleAddPatner = withPermission(canWriteNode, (nodeId: any) => {
  if (!subStore.guardAddPerson()) return;

  const rawData = family.get(nodeId);
  if (rawData) {
    selectedMember.value = structuredClone(rawData);
    isModelAddPartnerOpen.value = true;
  }
});

const onAddPartnerPerson = async (formData: PersonReq) => {
  try {
    await addPartnerMutation.mutateAsync(
      { personId: selectedMember.value.id, data: formData },
      {
        onSuccess: () => {
          isModelAddPartnerOpen.value = false;
          selectedMember.value = null;
          notify.success("Thông báo", "Thêm hôn phối thành công");
          refetchFamilyTree();
        },
        onError: () => {
          notify.error("Thông báo", "Thêm hôn phối không thành công");
        },
      }
    );
  } catch (error) {
    console.error("Lỗi khi thêm hôn phối:", error);
  }
};

// ================== ACTION ViewChildren ====================
const handleViewChildren = (nodeId: any) => {
  const rawData = family.get(nodeId);
  if (rawData) {
    selectedMember.value = structuredClone(rawData);
    viewRootId.value = rawData.id;
    // Sau khi lọc, tự động center vào node gốc mới
    setTimeout(() => {
      if (family) family.center(rawData.id, { ripple: true, slow: true, zoomState: 1.2 });
    }, 100);
  }
};

// ================== ACTION EditNode ====================
const isModalUpdateChildrenOpen = ref<boolean>(false);
const updatePersonMutation = useUpdatePersonMutation();

const handleEditNode = withPermission(canWriteNode, (nodeId: any) => {
  const rawData = family.get(nodeId);
  if (rawData) {
    selectedMember.value = structuredClone(rawData);
    isModalUpdateChildrenOpen.value = true;
  }
});

const onEditNode = async (FormData: PersonReq) => {
  try {
    await updatePersonMutation.mutateAsync(
      { personId: selectedMember.value.id, data: FormData },
      {
        onSuccess: () => {
          isModalUpdateChildrenOpen.value = false;
          selectedMember.value = null;
          notify.success("Thông báo", "Cập nhật thành viên thành công");
          refetchFamilyTree();
        },
        onError: () => {
          notify.error("Thông báo", "Cập nhật thành viên không thành công");
        },
      }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật thành viên:", error);
  }
};

// ================== ACTION RemoveNode ====================
const deletePersonMutation = useDeletePersonMutation();

const hanldeRemoveNode = withPermission(canDeleteNode, (nodeId: any) => {
  const rawData = family.get(nodeId);
  if (rawData && window.confirm("Bạn có muốn xóa thành viên này không !")) {
    deletePersonMutation.mutate(rawData.id, {
      onSuccess: () => {
        notify.success("Thông báo", "Xóa thành viên thành công");
        refetchFamilyTree();
      },
      onError: () => notify.error("Thông báo", "Thành viên phải không có con cái !"),
    });
  }
});

// ------------------- Tìm kiếm -------------------
const searchQuery = ref("");

const handleSearch = (query?: string) => {
  const term = (query !== undefined ? query : searchQuery.value)?.trim().toLowerCase();
  if (!term || !family) return;
  const allNodesData = family.config.nodes;
  const foundMember = allNodesData?.find((node: any) =>
    node.personName?.toLowerCase().includes(term)
  );
  if (foundMember) {
    const nodeId = foundMember.id;
    try {
      family.center(nodeId, { ripple: true, slow: true, zoomState: 0.5 });
      family.search(term);
      const nodeElement = treeRef.value?.querySelector(`[data-n-id="${nodeId}"]`);
      if (nodeElement) {
        nodeElement.classList.add("found-node-highlight");
        treeRef.value?.classList.add("is-searching");
        setTimeout(() => {
          nodeElement.classList.remove("found-node-highlight");
          treeRef.value?.classList.remove("is-searching");
        }, 5000);
      }
    } catch (e) {
      console.error(e);
      family.fit(nodeId);
    }
  } else {
    notify.error("Không tìm thấy thành viên");
  }
};

const searchSuggestions = computed(() => {
  const query = searchQuery.value?.trim().toLowerCase();
  if (!query || !family) return [];
  return (
    family.config.nodes?.filter((node: any) =>
      node.personName?.toLowerCase().includes(query)
    ).slice(0, 6) || []
  );
});

const selectSuggestion = (member: any) => {
  searchQuery.value = member.personName;
  if (!family) return;
  const nodeId = member.id;
  try {
    family.center(nodeId, { ripple: true, slow: true, zoomState: 2 });
    family.search(member.personName);
    const nodeElement = treeRef.value?.querySelector(`[data-n-id="${nodeId}"]`);
    if (nodeElement) {
      nodeElement.classList.add("found-node-highlight");
      treeRef.value?.classList.add("is-searching");
      setTimeout(() => {
        nodeElement.classList.remove("found-node-highlight");
        treeRef.value?.classList.remove("is-searching");
      }, 5000);
    }
  } catch (e) {
    family.fit();
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  treeRef.value?.classList.remove("is-searching");
  treeRef.value?.querySelectorAll(".found-node-highlight").forEach((el) =>
    el.classList.remove("found-node-highlight")
  );
  family?.fit();
};

// ------------------- Mini map, reset view -------------------
const toggleMiniMap = () => {
  isMiniMap.value = !isMiniMap.value;
  if (family) {
    family.config.miniMap = isMiniMap.value;
    family.draw();
  }
};

const resetView = async () => {
  viewRootId.value = null;
  await refetchFamilyTree();
  if (family) {
    family.fit({ slow: true, ripple: true });
  }
};


// ------------------- Export functions -------------------
// ─────────────────────────────────────────
//  HELPER: convert 1 URL → base64 via Canvas
// ─────────────────────────────────────────
async function urlToBase64(url: string): Promise<string> {
  if (!url || url.startsWith("data:")) return url;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth || 80;
      c.height = img.naturalHeight || 80;
      c.getContext("2d")!.drawImage(img, 0, 0);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(url); // fallback giữ nguyên URL nếu lỗi
    img.src = url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now();
  });
}

// ─────────────────────────────────────────
//  CORE: Clone SVG từ DOM, embed nền + avatar
// ─────────────────────────────────────────
async function buildSVG(): Promise<{ svg: string; w: number; h: number }> {
  const el = treeRef.value?.querySelector("svg") as SVGSVGElement;
  if (!el) throw new Error("SVG not found");

  // ✅ Đọc ĐẦY ĐỦ viewBox: x, y, width, height
  const vb = el.viewBox?.baseVal;
  const vbX = vb?.x ?? 0;
  const vbY = vb?.y ?? 0;
  const vbW = (vb?.width && vb.width > 0) ? vb.width : el.scrollWidth || 2000;
  const vbH = (vb?.height && vb.height > 0) ? vb.height : el.scrollHeight || 1500;

  const cloned = el.cloneNode(true) as SVGSVGElement;
  // Set width/height = vbW/vbH để canvas render đúng tỉ lệ
  cloned.setAttribute("width", String(vbW));
  cloned.setAttribute("height", String(vbH));
  // Normalize viewBox về 0,0 để background khớp
  cloned.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);

  // ── Convert avatar → base64 ──
  const imgEls = Array.from(cloned.querySelectorAll("image"));
  await Promise.all(imgEls.map(async (img) => {
    const href = img.getAttribute("xlink:href") || img.getAttribute("href") || "";
    if (href && !href.startsWith("data:")) {
      const b64 = await urlToBase64(href);
      img.setAttribute("xlink:href", b64);
      img.setAttribute("href", b64);
    }
  }));

  // ── Inject nền: dùng đúng x,y,w,h từ viewBox ──
  if (bgBase64.value) {
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "image");
    bg.setAttribute("href", bgBase64.value);
    bg.setAttribute("xlink:href", bgBase64.value);
    // ✅ x,y phải bằng vbX,vbY để phủ đúng vùng hiển thị
    bg.setAttribute("x", String(vbX));
    bg.setAttribute("y", String(vbY));
    bg.setAttribute("width", String(vbW));
    bg.setAttribute("height", String(vbH));
    bg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    bg.setAttribute("opacity", "0.45");
    cloned.insertBefore(bg, cloned.firstChild);
  }

  let svg = new XMLSerializer().serializeToString(cloned);
  if (!svg.includes('xmlns="http://www.w3.org/2000/svg"'))
    svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  if (!svg.includes("xmlns:xlink"))
    svg = svg.replace("<svg", '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');

  return { svg, w: vbW, h: vbH };
}

// ─────────────────────────────────────────
//  EXPORT PDF
// ─────────────────────────────────────────
async function exportPdf() {
  if (!family) return;
  notify.info('Thông báo', 'Đang xuất PDF, vui lòng chờ...');
  family.fit();
  await new Promise(r => setTimeout(r, 600));
  try {
    const { jsPDF } = await import('jspdf');
    const { svg, w, h } = await buildSVG();

    // Render SVG → Canvas
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f3e5ab';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url); resolve(); };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    // Kích thước trang
    const pdfW = 297;
    const pdfH = Math.max(Math.round((h / w) * pdfW), 210);
    const orientation = pdfH > pdfW ? 'portrait' : 'landscape';
    const pdf = new jsPDF({ orientation, unit: 'mm', format: [pdfW, pdfH] });

    const GOLD = '#B89554';
    const BROWN = '#6B5A3A';
    const LIGHT = '#F5EEDC';
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // ─── Nền trang ───
    pdf.setFillColor(253, 250, 240);
    pdf.rect(0, 0, pdfW, pdfH, 'F');

    // ─── Viền ngoài ───
    pdf.setDrawColor(184, 149, 84);
    pdf.setLineWidth(1.2);
    pdf.rect(6, 6, pdfW - 12, pdfH - 12);
    pdf.setLineWidth(0.4);
    pdf.rect(9, 9, pdfW - 18, pdfH - 18);

    // ─── Header band ───
    pdf.setFillColor(184, 149, 84);
    pdf.rect(6, 6, pdfW - 12, 18, 'F');

    // Tiêu đề chính
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(255, 255, 255);
    pdf.text('GIA PHA DONG HO', pdfW / 2, 17, { align: 'center' });

    // Đường kẻ trang trí dưới header
    pdf.setDrawColor(245, 238, 220);
    pdf.setLineWidth(0.5);
    pdf.line(20, 25, pdfW - 20, 25);

    // ─── Nội dung cây ───
    const contentY = 28;
    const contentH = pdfH - contentY - 18;
    pdf.addImage(imgData, 'JPEG', 10, contentY, pdfW - 20, contentH);

    // ─── Footer band ───
    const footerY = pdfH - 14;
    pdf.setFillColor(245, 238, 220);
    pdf.rect(6, footerY - 2, pdfW - 12, 10, 'F');

    pdf.setDrawColor(184, 149, 84);
    pdf.setLineWidth(0.4);
    pdf.line(10, footerY - 2, pdfW - 10, footerY - 2);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(107, 90, 58);
    pdf.text(`Ngay xuat: ${dateStr}`, 14, footerY + 4);
    pdf.text('GiaPhaOnline.vn', pdfW / 2, footerY + 4, { align: 'center' });
    pdf.text('Trang 1 / 1', pdfW - 14, footerY + 4, { align: 'right' });

    pdf.save(`Gia-pha-${now.getFullYear()}.pdf`);
    notify.success('Thông báo', 'Xuất PDF thành công!');
  } catch (err) {
    console.error('Export PDF lỗi:', err);
    notify.error('Thông báo', 'Xuất PDF thất bại');
  }
}
// ─────────────────────────────────────────
//  EXPORT PNG
// ─────────────────────────────────────────
async function exportPNG() {
  if (!family) return;
  notify.info('Thông báo', 'Đang xuất PNG, vui lòng chờ...');
  family.fit();
  await new Promise(r => setTimeout(r, 600));
  try {
    const { svg, w, h } = await buildSVG();

    // Scale 2x để chất lượng cao
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d")!;

    // Nền fallback
    ctx.fillStyle = "#f3e5ab";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      // ✅ KHÔNG set crossOrigin cho blob URL — gây lỗi
      img.onload = () => {
        // ✅ Scale để fill đúng canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        console.error("SVG load error:", e);
        reject(new Error("SVG render thất bại"));
      };
      img.src = url;
    });

    canvas.toBlob((b) => {
      if (!b) { notify.error("Thông báo", "Xuất PNG thất bại"); return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "Gia-pha.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, "image/png");

  } catch (err) {
    console.error("Export PNG lỗi:", err);
    notify.error("Thông báo", "Xuất PNG thất bại");
  }
}
// ─────────────────────────────────────────
//  EXPORT SVG
// ─────────────────────────────────────────
async function exportSVG() {
  if (!family) return;
  notify.info('Thông báo', 'Đang xuất SVG, vui lòng chờ...');
  family.fit();
  await new Promise(r => setTimeout(r, 600));
  try {
    const { svg, w, h } = await buildSVG();

    // ✅ Thêm rect nền màu trước <image> background để SVG đẹp hơn khi mở trực tiếp
    const bgRect = `<rect x="0" y="0" width="${w}" height="${h}" fill="#f3e5ab"/>`;
    // Chèn rect vào ngay sau thẻ <svg ...>
    const finalSvg = svg.replace(
      /(<svg[^>]*>)/,
      (match) => match + bgRect
    );

    const blob = new Blob([finalSvg], { type: "image/svg+xml;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Gia-pha.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);

  } catch (err) {
    console.error("Export SVG lỗi:", err);
    notify.error("Thông báo", "Xuất SVG thất bại");
  }
}
</script>

<template>
  <div class="flex h-screen flex-col bg-slate-50 font-sans">
    <HeaderFamilyTree v-model="searchQuery" :isMiniMap="isMiniMap" :searchSuggestions="searchSuggestions"
      @toggleMiniMap="toggleMiniMap" @resetView="resetView" @goToRoot="hanldeRootFocus" @search="handleSearch"
      @clearSearch="clearSearch" @selectSuggestion="selectSuggestion" @exportPDF="exportPdf"
      @exportPNG="exportPNG" @exportSVG="exportSVG" />


    <div class="flex-1 overflow-hidden border-2 border-slate-200 shadow-inner parchment-bg relative">

      <!-- tree render -->
      <div ref="treeRef" class="h-full w-full parchment-bg"></div>

      <!-- Loading overlay khi đang tải dữ liệu -->
      <div v-if="isLoadingFamilyTree"
        class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-30">
        <div class="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p class="text-stone-700 font-medium">Đang tải dữ liệu gia phả...</p>
          <p class="text-stone-500 text-sm mt-1">Vui lòng chờ trong giây lát</p>
        </div>
      </div>

      <!-- Empty state overlay -->
      <div v-if="isEmpty" class="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm z-20">
        <div class="text-center p-8 bg-white/90 rounded-2xl shadow-xl max-w-md mx-4">
          <svg class="w-20 h-20 mx-auto text-amber-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 class="text-2xl font-serif text-stone-800 mb-2">Chưa có thành viên</h3>
          <p class="text-stone-500 mb-6">Hãy thêm thành viên đầu tiên để bắt đầu gia phả</p>
          <button @click="handleAddFirstNodeOpen"
            class="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-full shadow-md transition">
            + Thêm thành viên đầu tiên
          </button>
        </div>
      </div>
    </div>


    <!--  modal -->
    <AddFistPersonModal :is-open="isModalAddFirstNodeOpen" @close="isModalAddFirstNodeOpen = false"
      @save="onCreateRootPerson" />

    <AddPartnerModel :isOpen="isModelAddPartnerOpen" :member="selectedMember" @close="isModelAddPartnerOpen = false"
      @save="onAddPartnerPerson" />

    <AddChildrenModal :isOpen="isModalAddChildrenOpen" :member="selectedMember" @close="isModalAddChildrenOpen = false"
      @save="onAddChildPerson" />

    <AddSiblingsModal :isOpen="isModalAddSiblingOpen" :member="selectedMember" @close="isModalAddSiblingOpen = false"
      @save="onAddSiblingPerson" />

    <EditPersonModal :isOpen="isModalUpdateChildrenOpen" :member="selectedMember"
      @close="isModalUpdateChildrenOpen = false" @save="onEditNode" />
  </div>
</template>

<style scoped>
/* ====================  NODE MENU ================ */

/* Ép các item menu hiển thị theo hàng ngang, icon và text cùng dòng */
:deep(.bft-family-menu div[data-item]),
:deep(.bft-family-menu [data-item]) {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  white-space: nowrap !important;
  padding-right: 20px !important;
}

/* Đảm bảo icon không bị co lại */
:deep(.bft-family-menu svg) {
  flex-shrink: 0 !important;
}

/* Nếu menu quá hẹp, cho phép nở rộng theo nội dung */
:deep(.bft-family-menu) {
  min-width: max-content !important;
}

/* ====================  TEMPLATE ================ */

:deep(.bft-minimap) {
  background-color: rgba(243, 229, 171, 0.8) !important;
  /* Màu giấy có độ trong suốt */
  opacity: 0.9;
}

/* Ẩn bớt các nút điều hướng bên trong minimap nếu thấy rối */
:deep(.bft-minimap .bft-button) {
  display: none;
}

/* Ẩn thanh công cụ mặc định (Search.) */
:deep([data-ctrl-menu]),
:deep(.bft-control-container),
:deep(.bft-search) {
  display: none !important;
}

:deep(.bft-search-results) {
  display: block !important;
  position: fixed !important;
  top: 80px !important;
  right: 24px !important;
  z-index: 999;
}

/* 1. Tô màu đỏ và làm to tất cả các đường vẽ */
:deep(.bft-link path),
:deep(.link path),
:deep(g[data-link] path) {
  stroke: #6a6a6a !important;
  stroke-width: 5px !important;
}

/* 2. Ngay lập tức TRẢ LẠI trạng thái cũ cho icon trong node và menu để không bị đỏ/to */
:deep(.menu-button path) {
  stroke: initial !important;
  stroke-width: initial !important;
}

/* Nền familytree phong cách giấy cũ đậm nét */
.parchment-bg {
  background-color: #f3e5ab !important;
  background-image: v-bind(bgImageStyle) !important;
  background-blend-mode: multiply;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.1) !important;
  background-size: cover;
}

/* Đè (override) để hiện nền giấy, nhưng không làm trong suốt các menu */
.parchment-bg svg:first-child {
  background: transparent !important;
}

/* Đảm bảo menu và các form chỉnh sửa */
[data-ctrl-n-menu],
[data-ctrl-ec-f],
.bft-menu,
.bft-edit-form {
  background-color: white !important;
  background-image: none !important;
  opacity: 1 !important;
}

/* Định vị lại danh sách kết quả để nó nhảy đúng vào dưới ô tìm kiếm của bạn */
.bft-search-results {
  display: block !important;
  position: fixed !important;
  top: 80px !important;
  right: 24px !important;
  z-index: 999;
}


/* 1. Khi đang tìm kiếm, làm mờ các node không liên quan */
:deep(.is-searching) :deep([data-n-id]) {
  opacity: 0.35;
  transition: opacity 0.6s ease;
}

/* 2. Node được tìm thấy giữ độ rõ nét 100% */
:deep(.is-searching) :deep(.found-node-highlight) {
  opacity: 1;
}

/* 3. Chỉ hiệu ứng viền cho khung hình chữ nhật chính (khung ngoài cùng) */
:deep(.found-node-highlight)> :deep(rect:first-child) {
  stroke: #007bff !important;
  stroke-width: 4px !important;
  stroke-dasharray: 8;
  animation: dash-draw 5s linear infinite;
  fill: #fffbeb !important;
}

@keyframes dash-draw {
  from {
    stroke-dashoffset: 100;
  }

  to {
    stroke-dashoffset: 0;
  }
}
</style>