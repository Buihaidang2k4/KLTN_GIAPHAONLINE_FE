<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import FamilyTree from "@balkangraph/familytree.js";
import bg_familytree from "@/assets/images/bg_familyTree.jpg";
import { notify } from "@/utils/notify";
import router from "@/app/router";
import { useMyInfoQuery } from "@/hooks/queries/account/useAccount";
import { useFamilyStore } from "@/store/family/useFamilyStore";
import AddMemberModal from "@/components/forms/family_tree/AddChildrenModal.vue";
import EditMemberModal from "@/components/forms/family_tree/EditChildrenModal.vue";
import AddSiblingsModal from "@/components/forms/family_tree/AddSiblingsModal.vue";
import { useRoute } from "vue-router";
import { useFamilyTreeQuery } from "@/hooks/queries/family/family_tree/useFamilyTree";
import male_default from "@/assets/tree/male_default.jpg";
import female_default from "@/assets/tree/female_default.jpg";
import { formatDate } from "@/utils/format-date";
import type { FamilyTreeNodeRes } from "@/types/family/family_tree.types";



const iconMenu = {
  addSiblings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  addPartner: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e91e63" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  addChildren: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  viewChildren: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="23 13 23 17 19 17"/><path d="M23 13l-4 4"/></svg>',
  rootFocus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  edit: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>',
  remove: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
}



const route = useRoute();
const bgImageStyle = computed(() => `url(${bg_familytree})`);

const treeRef = ref<HTMLDivElement | null>(null);
const isModalUpdateChildrenOpen = ref<boolean>(false);
const isModalAddChildrenOpen = ref<boolean>(false);
const isModalAddSiblingOpen = ref<boolean>(false);

const selectedMember = ref<any>(null);
let family: any = null;
const isMiniMap = ref<boolean>(false);
const categoryId = computed(() => Number(route.query.categoryId))

// data
const { data: familyTreeData } = useFamilyTreeQuery(categoryId);
const safeFamilyTrees = computed(() => familyTreeData.value?.data || [])


// Chuẩn hóa dữ liệu từ API về format FamilyTree
const processedFamilyData = computed(() => {
  return safeFamilyTrees.value.map((node: any) => {

    // Ảnh mặc định nếu không có avatarUrl
    const defaultAvatar = node.gender === "male"
      ? male_default
      : female_default

    return {
      id: node.id,
      fid: node.fid || null,
      mid: node.mid || null,
      pids: node.pids || [],
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


const rootId = ref<string[]>(["6"]);



onMounted(() => {

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
        .menu-button:hover .menu-bg {
          opacity: 0.2;
        }
      </style>
    `;

      // Node nam
      FamilyTree.templates.john.node =
        '<rect x="0" y="0" height="182" width="172" fill="url(#maleGrad)" stroke-width="1.8" stroke="#B89554" rx="8" ry="8" filter="url(#nodeShadow)"></rect>' +

        '<g class="menu-button" style="cursor:pointer; pointer-events:all;" transform="translate(136, 13)" data-ctrl-n-menu-id="{id}">' +
        '<circle class="menu-bg" cx="12" cy="12" r="12" fill="#B89554" opacity="0.14"/>' +
        '<path fill="#6B5A3A" d="M12 7.6c.32 0 .63.03.93.1l.42-1.08c.07-.18.27-.28.45-.2l1.05.44c.18.08.27.28.2.46l-.46 1.05c.48.33.9.75 1.23 1.23l1.05-.46c.18-.08.39 0 .46.2l.44 1.05c.08.18-.02.39-.2.45l-1.08.42c.06.3.1.61.1.93s-.04.63-.1.93l1.08.42c.18.07.28.27.2.45l-.44 1.05c-.07.18-.28.27-.46.2l-1.05-.46c-.33.48-.75.9-1.23 1.23l.46 1.05c.08.18 0 .39-.2.46l-1.05.44c-.18.08-.39-.02-.45-.2l-.42-1.08c-.3.06-.61.1-.93.1s-.63-.04-.93-.1l-.42 1.08c-.07.18-.27.28-.45.2l-1.05-.44c-.18-.07-.27-.28-.2-.46l.46-1.05c-.48-.33-.9-.75-1.23-1.23l-1.05.46c-.18.08-.39 0-.46-.2l-.44-1.05c-.08-.18.02-.39.2-.45l1.08-.42c-.06-.3-.1-.61-.1-.93s.04-.63.1-.93l-1.08-.42c-.18-.07-.28-.27-.2-.45l.44-1.05c.07-.18.28-.27.46-.2l1.05.46c.33-.48.75-.9 1.23-1.23l-.46-1.05c-.08-.18 0-.39.2-.46l1.05-.44c.18-.08.39.02.45.2l.42 1.08c.3-.07.61-.1.93-.1Zm0 2.7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"/>' +
        '</g>';

      // Không cần clip_0 nữa vì đã khai báo trong defs
      FamilyTree.templates.john.clip_0 = '';

      FamilyTree.templates.john.img_0 =
        '<g filter="url(#avatarSoftShadow)">' +
        '<rect x="41" y="20" width="90" height="90" rx="20" ry="20" fill="#FFFDF8" stroke="#E4D6BC" stroke-width="1.2"></rect>' +
        '<g clip-path="url(#johnAvatarClip)">' +
        '<image preserveAspectRatio="xMidYMid slice" x="46" y="25" width="80" height="80" xlink:href="{val}"></image>' +
        '</g>' +
        '</g>';

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
        '</g>';

      FamilyTree.templates.john.nodeMenuButton =
        '<g style="cursor:pointer;" transform="matrix(1,0,0,1,136,13)" data-ctrl-n-menu-id="{id}">' +
        '<rect x="0" y="0" fill="transparent" width="24" height="24"></rect>' +
        '</g>';


      // ================= TEMPLATE NỮ =================
      FamilyTree.templates.jane = Object.assign({}, FamilyTree.templates.john);

      FamilyTree.templates.jane.node =
        '<rect x="0" y="0" height="182" width="172" fill="url(#femaleGrad)" stroke-width="1.8" stroke="#B97854" rx="8" ry="8" filter="url(#nodeShadow)"></rect>' +

        '<g class="menu-button" style="cursor:pointer; pointer-events:all;" transform="translate(136, 13)" data-ctrl-n-menu-id="{id}">' +
        '<circle class="menu-bg" cx="12" cy="12" r="12" fill="#B97854" opacity="0.14"/>' +
        '<path fill="#74513E" d="M12 7.6c.32 0 .63.03.93.1l.42-1.08c.07-.18.27-.28.45-.2l1.05.44c.18.08.27.28.2.46l-.46 1.05c.48.33.9.75 1.23 1.23l1.05-.46c.18-.08.39 0 .46.2l.44 1.05c.08.18-.02.39-.2.45l-1.08.42c.06.3.1.61.1.93s-.04.63-.1.93l1.08.42c.18.07.28.27.2.45l-.44 1.05c-.07.18-.28.27-.46.2l-1.05-.46c-.33.48-.75.9-1.23 1.23l.46 1.05c.08.18 0 .39-.2.46l-1.05.44c-.18.08-.39-.02-.45-.2l-.42-1.08c-.3.06-.61.1-.93.1s-.63-.04-.93-.1l-.42 1.08c-.07.18-.27.28-.45.2l-1.05-.44c-.18-.07-.27-.28-.2-.46l.46-1.05c-.48-.33-.9-.75-1.23-1.23l-1.05.46c-.18.08-.39 0-.46-.2l-.44-1.05c-.08-.18.02-.39.2-.45l1.08-.42c-.06-.3-.1-.61-.1-.93s.04-.63.1-.93l-1.08-.42c-.18-.07-.28-.27-.2-.45l.44-1.05c.07-.18.28-.27.46-.2l1.05.46c.33-.48.75-.9 1.23-1.23l-.46-1.05c-.08-.18 0-.39.2-.46l1.05-.44c.18-.08.39.02.45.2l.42 1.08c.3-.07.61-.1.93-.1Zm0 2.7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"/>' +
        '</g>';

      FamilyTree.templates.jane.clip_0 = '';

      FamilyTree.templates.jane.img_0 =
        '<g filter="url(#avatarSoftShadow)">' +
        '<rect x="41" y="20" width="90" height="90" rx="20" ry="20" fill="#FFF9F2" stroke="#E3CBB9" stroke-width="1.2"></rect>' +
        '<g clip-path="url(#janeAvatarClip)">' +
        '<image preserveAspectRatio="xMidYMid slice" x="46" y="25" width="80" height="80" xlink:href="{val}"></image>' +
        '</g>' +
        '</g>';

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
        '</g>';



      family = new FamilyTree(treeRef.value, {
        template: "john",
        nodeBinding: {
          field_0: "personName",
          field_1: "birthDate",
          field_gen: "generation",
          img_0: "avatar",
        },
        tags: {
          NAM: {
            template: "john",
          },
          NU: {
            template: "jane",
          }
        },

        nodeMenu: getNodeMenu,
        // {
        //   // ========== NHÓM THÊM ==========
        //   addSiblings: {
        //     text: "Thêm đời đầu",
        //     icon: iconMenu.addSiblings,
        //     onClick: hanldeAddSiblings
        //   },
        //   addPartner: {
        //     text: "Thêm hôn thê",
        //     icon: iconMenu.addPartner,
        //     onClick: handleAddPatner
        //   },
        //   addChildren: {
        //     text: "Thêm con",
        //     icon: iconMenu.addChildren,
        //     onClick: hanldeClickAddChilren
        //   },

        //   // ========== NHÓM XEM ==========
        //   viewChildren: {
        //     text: "Xem đời sau",
        //     icon: iconMenu.viewChildren,
        //     onClick: handleViewChildren
        //   },
        //   rootFocus: {
        //     text: "Trở về gốc",
        //     icon: iconMenu.rootFocus,
        //     onClick: hanldeRootFocus
        //   },

        //   // ========== NHÓM CHỈNH SỬA & XÓA ==========
        //   editNode: {
        //     text: "Chỉnh sửa",
        //     icon: iconMenu.edit,
        //     onClick: handleEditNode
        //   },
        //   remove: {
        //     text: "Xóa thành viên",
        //     icon: iconMenu.remove,
        //     onClick: hanldeRemoveNode
        //   }
        // },

        nodeMenuTrigger: (FamilyTree as any).action.nodeMenu,
        nodeMenuButton: '.menu-button',
        editForm: false,
        mouseScrool: (FamilyTree as any).action.zoom,

        // roots: [100],  // xác định thủy tổ
        roots: rootId.value,
        layout: "mixed",
        // layout: FamilyTree.layout.treeRight,


        // Tăng khoảng cách giữa các đời
        siblingSeparation: 100,
        levelSeparation: 200,
        partnerNodeSeparation: 50,
        enableSearch: true,
        showLevelLines: true,

        // chỉ định tìm kiếm theo fill
        searchFields: ["name"],
        // hiển thị tên gợi ý khi tìm kiếm 
        searchDisplayField: "name",
        // tô màu khi tìm kiếm 
        searchFieldsHighlight: {
          stroke: "red",
          strokeWidth: 5
        },

        // trọng số tìm kiếm cao nhất theo 
        searchFieldsWeight: {
          "Name": 100,
        },

        align: FamilyTree.align.center,

        // định hướng 
        orientation: FamilyTree.orientation.top,
        padding: 100,

        // khoảng cách vợ chồng
        partnerChildrenSplitSeparation: 180,

        // hiển thị zoom mặc định 
        scaleInitial: 1,
        // zoom in out , max min
        scaleMax: 10,
        // scaleMin: 0.5,

        subtreeSeparation: 150, // Tăng lên 100 để các chi/nhánh tách biệt rõ ràng hơn
        zoom: {
          speed: 130,
          smooth: 10
        },

        expandAll: true,
        // Không mở hết tất cả
        // collapse: {
        //   level: 1, // Tự động thu gọn từ đời thứ 2 trở đi
        //   allChildren: true
        // },
        nodeCircleMenu: true,
        miniMap: isMiniMap.value,
      } as any);


      // Nạp dữ liệu vào cây
      family.load(processedFamilyData.value);
      family.draw();
    }
  }, 0);
});

watch(processedFamilyData, (newData) => {
  if (family && newData.length) {
    family.load(newData);
    family.draw();
  }
}, { immediate: true });

// node menu
const getNodeMenu = (node: any) => {
  console.log("get nodeeee",node)
    return {
      addSiblings: {
        text: "Thêm đời đầu",
        icon: iconMenu.addSiblings,
        onClick: hanldeAddSiblings
      },
      addPartner: {
        text: node.gender === 'male' ? "Thêm hôn thê" : "Thêm hôn phu",
        icon: iconMenu.addPartner,
        onClick: handleAddPatner
      },
      addChildren: {
        text: "Thêm con",
        icon: iconMenu.addChildren,
        onClick: hanldeClickAddChilren
      },
      viewChildren: {
        text: "Xem đời sau",
        icon: iconMenu.viewChildren,
        onClick: handleViewChildren
      },
      rootFocus: {
        text: "Trở về gốc",
        icon: iconMenu.rootFocus,
        onClick: hanldeRootFocus
      },
      editNode: {
        text: "Chỉnh sửa",
        icon: iconMenu.edit,
        onClick: handleEditNode
      },
      remove: {
        text: "Xóa thành viên",
        icon: iconMenu.remove,
        onClick: hanldeRemoveNode
      }
  } 

// else {
//     // Nữ
//     return {
//       addPartner: {
//         text: "Thêm hôn phu",
//         icon: iconMenu.addPartner,
//         onClick: handleAddPatner
//       },
//       addChildren: {
//         text: "Thêm con",
//         icon: iconMenu.addChildren,
//         onClick: hanldeClickAddChilren
//       },
//       viewChildren: {
//         text: "Xem đời sau",
//         icon: iconMenu.viewChildren,
//         onClick: handleViewChildren
//       },
//       editNode: {
//         text: "Chỉnh sửa",
//         icon: iconMenu.edit,
//         onClick: handleEditNode
//       },
//       remove: {
//         text: "Xóa thành viên",
//         icon: iconMenu.remove,
//         onClick: hanldeRemoveNode
//       }
//     };
//   }
};






//  =========== check role ================
const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

const { data: myInfoAccount } = useMyInfoQuery();

const checkRoleAccount = () => {

}

// ================== ACTION RootFocus  ====================
const hanldeRootFocus = () => {
  family.center("1", {
    ripple: true,
    zoomState: (FamilyTree as any).zoomIn,
    slow: true
  });
}


// ================== ACTION AddSiblings ====================
const checkRoleDisable = ref(false);

const hanldeAddSiblings = (nodeId: any) => {
  const rawData = family.get(nodeId);
  if (rawData && checkRoleDisable) {
    isModalAddSiblingOpen.value = true
    console.log('heheheheheh', rawData);
  } else {
    window.alert("Bạn không có quyền chỉnh sửa")
  }
}

// ================== ACTION AddChildren  ====================

const hanldeClickAddChilren = (nodeId: any) => {
  const rawData = family.get(nodeId);
  if (rawData) {
    selectedMember.value = structuredClone(rawData);
    isModalAddChildrenOpen.value = true;
  }
}


// ================== ACTION AddPatner  ====================

const handleAddPatner = () => {
  window.alert("addd parrert")

}

// ================== ACTION ViewChildren  ====================

const handleViewChildren = () => {

}


// ================== ACTION EditNode  ====================
const handleEditNode = (nodeId: any) => {
  const rawData = family.get(nodeId);
  if (rawData) {
    selectedMember.value = structuredClone(rawData);
    isModalUpdateChildrenOpen.value = true;
  }
}

// ================== ACTION RemoveNode  ====================
const hanldeRemoveNode = (nodeId: any) => {
  const rawData = family.get(nodeId);

}




// save member
const onSaveMember = (updatedData: any) => {
  if (family && updatedData) {
    try {
      family.updateNode(updatedData);
      isModalUpdateChildrenOpen.value = false;
    } catch (error) {
      console.error("Lỗi khi cập nhật node vào FamilyTree:", error);
    }
  }
};


// ------------------- Tìm kiếm -------------------
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);

const handleSearch = () => {
  const term = searchQuery.value?.trim().toLowerCase();
  if (!term || !family) return;
  const allNodesData = family.config.nodes;
  const foundMember = allNodesData?.find((node: any) =>
    node.name?.toLowerCase().includes(term)
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
  return family.config.nodes?.filter((node: any) =>
    node.name?.toLowerCase().includes(query)
  ).slice(0, 6) || [];
});

const selectSuggestion = (member: any) => {
  searchQuery.value = member.name;
  handleSearch();
};

const clearSearch = () => {
  searchQuery.value = "";
  treeRef.value?.classList.remove("is-searching");
  treeRef.value?.querySelectorAll(".found-node-highlight").forEach(el =>
    el.classList.remove("found-node-highlight")
  );
  family?.fit();
  searchInputRef.value?.focus();
};

// ------------------- Mini map, reset view, go back -------------------
const toggleMiniMap = () => {
  isMiniMap.value = !isMiniMap.value;
  if (family) {
    family.config.miniMap = isMiniMap.value;
    family.draw();
  }
};

const resetView = () => {
  if (family) {
    family.fit({ slow: true, ripple: true });
  }
};

const goBack = () => {
  router.go(-1);
};

</script>


<template>
  <div class="flex h-screen flex-col bg-slate-50 font-sans">
    <header
      class="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-5 py-2.5 shadow-sm">
      <!-- Bên trái: nút quay lại + tên trang -->
      <div class="flex items-center gap-3">
        <button @click="goBack"
          class="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm transition cursor-pointer hover:bg-amber-50 hover:border-amber-300">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Quay lại
        </button>
        <div class="hidden h-6 w-px bg-amber-200 sm:block"></div>
        <div class="hidden items-center gap-2 sm:flex">
          <svg class="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span class="text-sm font-semibold text-amber-900 tracking-wide">Gia Phả</span>
        </div>
      </div>

      <!-- Bên phải: thanh công cụ + tìm kiếm -->
      <div class="flex items-center gap-2">
        <!-- Nhóm nút chức năng -->
        <div class="flex items-center gap-1 rounded-lg  border border-amber-100 bg-white p-1 shadow-sm">
          <button @click="toggleMiniMap" :class="[
            'flex items-center gap-1.5 rounded-md cursor-pointer px-3 py-1.5 text-xs font-medium transition',
            isMiniMap
              ? 'bg-amber-100 text-amber-700 shadow-inner'
              : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700'
          ]">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="7" y="7" width="4" height="4" />
            </svg>
            {{ isMiniMap ? 'Tắt map' : 'Bật map' }}
          </button>
          <div class="h-4 w-px bg-slate-200"></div>
          <button @click="resetView"
            class="flex items-center gap-1.5 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Đặt lại
          </button>
          <div class="h-4 w-px bg-slate-200"></div>
          <router-link to="/family/xuat-file"
            class="flex items-center gap-1.5 rounded-md px-3 cursor-pointer py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Xuất ảnh
          </router-link>
        </div>

        <!-- Ô tìm kiếm -->
        <div class="relative flex items-center gap-1.5">
          <div class="relative">
            <svg class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input v-model="searchQuery" ref="searchInputRef" type="text" placeholder="Tìm thành viên..."
              class="w-52 rounded-lg border border-amber-200 bg-white py-1.5 pl-8 pr-7 text-sm outline-none shadow-sm transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              @keyup.enter="handleSearch" />
            <button v-if="searchQuery" @click="clearSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button @click="handleSearch"
            class="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95">
            Tìm
          </button>

          <!-- Dropdown gợi ý -->
          <div v-if="searchSuggestions.length"
            class="absolute left-0 top-full z-10 mt-1.5 w-52 overflow-hidden rounded-xl border border-amber-100 bg-white shadow-lg">
            <div v-for="member in searchSuggestions" :key="member.id" @click="selectSuggestion(member)"
              class="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-amber-50">
              <img :src="member.photo" class="h-7 w-7 rounded-full object-cover ring-1 ring-amber-200" />
              <span class="text-slate-700">{{ member.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>


    <!--  tree -->
    <div class="flex-1 overflow-hidden border-2 border-slate-200 shadow-inner parchment-bg">
      <div ref="treeRef" class="h-full w-full parchment-bg"></div>
    </div>

    <!--  modal -->
    <AddMemberModal :isOpen="isModalAddChildrenOpen" :member="selectedMember" @close="isModalAddChildrenOpen = false"
      @save="onSaveMember" />

    <AddSiblingsModal :isOpen="isModalAddSiblingOpen" :member="selectedMember" @close="isModalAddSiblingOpen = false"
      @save="hanldeAddSiblings" />

    <EditMemberModal :isOpen="isModalUpdateChildrenOpen" :member="selectedMember"
      @close="isModalUpdateChildrenOpen = false" @save="onSaveMember" />
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