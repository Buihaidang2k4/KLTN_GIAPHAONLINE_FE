<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import FamilyTree from "@balkangraph/familytree.js";
import EditMemberModal from "@/components/family_tree/EditMemberModal.vue";
import AddMemberModal from "@/components/family_tree/AddMemberModal.vue";
import bg_familytree from "@/assets/images/bg_familyTree.jpg";
import { notify } from "@/utils/notify";
import ButtonBase from "@/components/common-ui/ButtonBase.vue";
import router from "@/app/router";
const bgImageStyle = computed(() => `url(${bg_familytree})`);

const treeRef = ref<HTMLDivElement | null>(null);
const isModalUpdateOpen = ref<boolean>(false);
const isModalAddOpen = ref<boolean>(false);
const selectedMember = ref<any>(null);
let family: any = null;
const isMiniMap = ref<boolean>(false);

const myData: any[] = [
  { id: "1", pids: ["2"], generation: "1", name: "Nguyễn Văn Tâm", title: "1940", gender: "male", photo: "https://cdn.balkan.app/shared/m60/1.jpg" },
  { id: "2", pids: ["1"], generation: "1", name: "Lê Thị Thanh", title: "1945", gender: "female", photo: "https://cdn.balkan.app/shared/w60/1.jpg" },
  { id: "3", fid: "1", mid: "2", pids: ["4"], generation: "2", name: "Nguyễn Quang", title: "1965", gender: "male", photo: "https://cdn.balkan.app/shared/m60/2.jpg" },
  { id: "4", pids: ["3"], generation: "2", name: "Hoàng Mỹ", title: "1968", gender: "female", photo: "https://cdn.balkan.app/shared/w60/2.jpg" },
  { id: "5", fid: "1", mid: "2", pids: ["6"], generation: "2", name: "Nguyễn Hùng", title: "1970", gender: "male", photo: "https://cdn.balkan.app/shared/m60/3.jpg" },
  { id: "6", pids: ["5"], generation: "2", name: "Phan Lan", title: "1972", gender: "female", photo: "https://cdn.balkan.app/shared/w60/3.jpg" },
  { id: "7", fid: "1", mid: "2", pids: ["8"], generation: "2", name: "Nguyễn Mai", title: "1975", gender: "female", photo: "https://cdn.balkan.app/shared/w30/1.jpg" },
  { id: "8", pids: ["7"], generation: "2", name: "Trần Thế", title: "1973", gender: "male", photo: "https://cdn.balkan.app/shared/m30/1.jpg" },
  { id: "9", fid: "1", mid: "2", generation: "2", name: "Nguyễn Tuấn", title: "1978", gender: "male", photo: "https://cdn.balkan.app/shared/m30/2.jpg" },
  { id: "10", fid: "1", mid: "2", generation: "2", name: "Nguyễn Thu", title: "1982", gender: "female", photo: "https://cdn.balkan.app/shared/w30/2.jpg" },
  { id: "11", fid: "3", mid: "4", pids: ["12"], generation: "3", name: "Nguyễn Anh", title: "1990", gender: "male", photo: "https://cdn.balkan.app/shared/m30/5.jpg" },
  { id: "12", pids: ["11"], generation: "3", name: "Lê Ngọc", title: "1992", gender: "female", photo: "https://cdn.balkan.app/shared/w30/5.jpg" },
  { id: "13", fid: "3", mid: "4", generation: "3", name: "Nguyễn Bảo", title: "1995", gender: "male", photo: "https://cdn.balkan.app/shared/m30/6.jpg" },
  { id: "14", fid: "5", mid: "6", pids: ["15"], generation: "3", name: "Nguyễn Cường", title: "1993", gender: "male", photo: "https://cdn.balkan.app/shared/m30/7.jpg" },
  { id: "15", pids: ["14"], generation: "3", name: "Đỗ Quyên", title: "1995", gender: "female", photo: "https://cdn.balkan.app/shared/w30/7.jpg" },
  { id: "16", fid: "5", mid: "6", generation: "3", name: "Nguyễn Diệu", title: "1998", gender: "female", photo: "https://cdn.balkan.app/shared/w30/8.jpg" },
  { id: "17", fid: "8", mid: "7", pids: ["18"], generation: "3", name: "Trần Long", title: "1996", gender: "male", photo: "https://cdn.balkan.app/shared/m30/8.jpg" },
  { id: "18", pids: ["17"], generation: "3", name: "Vũ Hạ", title: "1998", gender: "female", photo: "https://cdn.balkan.app/shared/w30/9.jpg" },
  { id: "19", fid: "8", mid: "7", generation: "3", name: "Trần Yến", title: "2000", gender: "female", photo: "https://cdn.balkan.app/shared/w10/1.jpg" },
  { id: "20", pids: ["21"], generation: "3", name: "Nguyễn Tuấn", title: "1978", gender: "male", photo: "https://cdn.balkan.app/shared/m30/2.jpg" },
  { id: "21", pids: ["20"], generation: "3", name: "Bùi Kim", title: "1985", gender: "female", photo: "https://cdn.balkan.app/shared/w30/10.jpg" },
  { id: "22", fid: "20", mid: "21", generation: "3", name: "Nguyễn Khôi", title: "2010", gender: "male", photo: "https://cdn.balkan.app/shared/m10/1.jpg" },
  { id: "23", fid: "11", mid: "12", generation: "4", name: "Nguyễn Minh", title: "2015", gender: "male", photo: "https://cdn.balkan.app/shared/m10/2.jpg" },
  { id: "24", fid: "11", mid: "12", generation: "4", name: "Nguyễn An", title: "2018", gender: "female", photo: "https://cdn.balkan.app/shared/w10/2.jpg" },
  { id: "25", fid: "14", mid: "15", generation: "4", name: "Nguyễn Bình", title: "2020", gender: "male", photo: "https://cdn.balkan.app/shared/m10/3.jpg" },
  { id: "26", fid: "14", mid: "15", generation: "4", name: "Nguyễn Ca", title: "2022", gender: "female", photo: "https://cdn.balkan.app/shared/w10/3.jpg" },
  { id: "27", fid: "17", mid: "18", generation: "4", name: "Trần Đăng", title: "2019", gender: "male", photo: "https://cdn.balkan.app/shared/m10/4.jpg" },
  { id: "28", fid: "17", mid: "18", generation: "4", name: "Trần Giao", title: "2021", gender: "female", photo: "https://cdn.balkan.app/shared/w10/4.jpg" },
  { id: "29", fid: "23", generation: "5", name: "Nguyễn GenZ", title: "2038", gender: "male", photo: "https://cdn.balkan.app/shared/m10/5.jpg" },
  { id: "30", fid: "23", generation: "5", name: "Nguyễn Alpha", title: "2040", gender: "female", photo: "https://cdn.balkan.app/shared/w10/5.jpg" }
];

onMounted(() => {
  if (treeRef.value) {
    FamilyTree.templates.john = Object.assign({}, FamilyTree.templates.base);
    FamilyTree.templates.john.size = [160, 170];
    // node nam  
    FamilyTree.templates.john.node =
      '<rect x="0" y="0" height="170" width="160" fill="#F2F6FB" stroke-width="1.5" stroke="#4A6FA5" rx="5" ry="5"></rect>' +
      '<g class="menu-button" style="cursor:pointer; pointer-events: all;" transform="translate(128, 10)">' +
      '<circle cx="12" cy="12" r="12" fill="#B07A6A" opacity="0.1"></circle>' +
      '<path fill="#64748B" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z" transform="scale(0.8) translate(3, 3)"></path>' +
      '</g>';

    // Định nghĩa trường hiển thị số đời (Dùng field_gen)
    FamilyTree.templates.john.field_gen =
      '<g transform="translate(10, 10)">' +
      '<circle cx="12" cy="12" r="10" fill="#4A6FA5" opacity="0.1"></circle>' +
      '<text fill="#4A6FA5" x="12" y="16" text-anchor="middle" style="font-size: 12px; font-weight: bold;">{val}</text>' +
      '</g>';

    FamilyTree.templates.john.clip_0 =
      '<clipPath id="johnClip"><circle cx="80" cy="45" r="35"></circle></clipPath>';
    FamilyTree.templates.john.circle_0 =
      '<circle cx="80" cy="45" r="40" fill="none" stroke="#B71C1C" stroke-width="3"></circle>';
    FamilyTree.templates.john.img_0 =
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#johnClip)" x="45" y="10" width="70" height="70" xlink:href="{val}"></image>';
    FamilyTree.templates.john.field_0 =
      '<text style="font-size: 17px; font-weight: 900; font-family: serif;" fill="Black" x="80" y="120" text-anchor="middle" pointer-events="none">{val}</text>';
    FamilyTree.templates.john.field_1 =
      '<text style="font-size: 14px; font-style: italic; font-family: serif;" fill="Black" x="80" y="145" text-anchor="middle" pointer-events="none">{val}</text>';

    // menu tùy chỉnh vị trí và hình dạng
    FamilyTree.templates.john.nodeMenuButton =
      `<g style="cursor:pointer;" transform="matrix(1,0,0,1,135,17)" data-ctrl-n-menu-id="{id}">
        <rect x="-4" y="-4" fill="#000000" fill-opacity="0" width="18" height="18"></rect>
      </g>`;

    // Con trỏ chuột cao cấp với hiệu ứng mạch đập (Premium Pulsing Pointer)
    FamilyTree.templates.john.pointer =
      `<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)">
        <circle cx="0" cy="0" r="22" fill="rgba(183, 28, 28, 0.15)">
            <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="6" fill="#B71C1C" />
        <circle cx="0" cy="0" r="12" fill="none" stroke="#B71C1C" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
        </circle>
    </g>`;

    // Nút khi nhánh đang đóng (Hiện dấu + để mở)
    FamilyTree.templates.john.plus =
      '<circle cx="80" cy="0" r="15" fill="#ffffff" stroke="#B71C1C" stroke-width="1"></circle>' +
      '<line x1="75" y1="0" x2="85" y2="0" stroke-width="1" stroke="#B71C1C"></line>' +
      '<line x1="80" y1="-5" x2="80" y2="5" stroke-width="1" stroke="#B71C1C"></line>';

    // node màu nữ
    FamilyTree.templates.jane = Object.assign({}, FamilyTree.templates.john);
    FamilyTree.templates.jane.node =
      '<rect x="0" y="0" height="170" width="160" fill="#FAF3F1" stroke-width="1.5" stroke="#B07A6A" rx="5" ry="5"></rect>' +
      '<g class="menu-button" style="cursor:pointer; pointer-events: all;" transform="translate(128, 10)">' +
      '<circle cx="12" cy="12" r="12" fill="#B07A6A" opacity="0.1"></circle>' +
      '<path fill="#64748B" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z" transform="scale(0.8) translate(3, 3)"></path>' +
      '</g>';
    FamilyTree.templates.jane.circle_0 =
      '<circle cx="80" cy="45" r="40" fill="none" stroke="#F472B6" stroke-width="3"></circle>';


    family = new FamilyTree(treeRef.value, {
      template: "john",
      siblingSeparation: 80,
      nodeBinding: {
        field_0: "name",
        field_1: "title",
        field_gen: "generation", // Thay 'val' bằng 'field_gen'
        img_0: "photo",
      },
      tags: {
        NAM: {
          template: "john",
        },
        NU: {
          template: "jane", // Sử dụng template màu hồng cho Nữ
        }
      },

      nodeMenu: {
        addSiblings: {
          text: "Thêm đời đầu",
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6FA5" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
        },
        viewChildren: {
          text: "Xem đời sau",
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="23 13 23 17 19 17"/><path d="M23 13l-4 4"/></svg>'
        },
        focus: {
          text: "Trở về gốc",
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
          onClick: () => {
            family.center("1", {
              ripple: true,
              zoomState: (FamilyTree as any).zoomIn,
              slow: true
            });
          }
        },
        copy: { text: "Sao chép dữ liệu", onClick: (nodeId: number) => { console.log("Copy node:", nodeId) } },
        addPartner: {
          text: "Thêm hôn thê",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#e91e63"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
        },
        add: {
          text: "Thêm con",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
          onClick: (nodeId: any) => {
            const rawData = family.get(nodeId);
            if (rawData) {
              selectedMember.value = structuredClone(rawData);
              isModalAddOpen.value = true;
            }
          }
        },
        edit: {
          text: "Chỉnh sửa",
          onClick: (nodeId: any) => {
            const rawData = family.get(nodeId);
            if (rawData) {
              selectedMember.value = structuredClone(rawData);
              isModalUpdateOpen.value = true;
            }
          }
        },
        remove: {
          text: "Xóa",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
        },
      },

      nodeMenuTrigger: (FamilyTree as any).action.nodeMenu,
      nodeMenuButton: '.menu-button',
      editForm: false,
      mouseScrool: (FamilyTree as any).action.zoom,

      roots: [1],  // xác định thủy tổ
      layout: "mixed",

      // Tăng khoảng cách giữa các đời
      levelSeparation: 150,
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
      partnerChildrenSplitSeparation: 80,

      // hiển thị zoom mặc định 
      scaleInitial: 1,
      // zoom in out , max min
      scaleMax: 10,
      // scaleMin: 0.5,

      subtreeSeparation: 100, // Tăng lên 100 để các chi/nhánh tách biệt rõ ràng hơn
      zoom: {
        speed: 130,
        smooth: 10
      },

      expandAll: true, // Không mở hết tất cả
      // collapse: {
      //   level: 1, // Tự động thu gọn từ đời thứ 2 trở đi
      //   allChildren: true
      // },
      nodeCircleMenu: true,
      miniMap: isMiniMap.value,
    } as any);



    myData.forEach(node => {
      if (!node.tags) {
        if (node.gender === "male") {
          node.tags = ["NAM"];
        } else if (node.gender === "female") {
          node.tags = ["NU"];
        }
      }
    });

    // Nạp dữ liệu vào cây
    family.load(myData);

    family.draw();

    // hanlde click node 
    // family.on("click", (_sender: any, args: any) => {

    //   if (args.event.target.classList.contains('menu-button') || args.event.target.closest('.menu-button')) {
    //     return;
    //   }

    //   args.cancel = true;

    //   const nodeId = args.node?.id as any;
    //   // Kiểm tra dữ liệu node trong args
    //   if (!nodeId) {
    //     console.warn("Không có nodeId trong args:", args);
    //     return;
    //   }

    //   // Lấy dữ liệu node từ cây
    //   const rawData = family.get(nodeId);
    //   if (rawData) {
    //     selectedMember.value = structuredClone(rawData);

    //     isModalOpen.value = true;
    //   } else {
    //     console.warn("Không tìm thấy dữ liệu cho node:", nodeId);
    //   }
    // });
  }
});

// save member
const onSaveMember = (updatedData: any) => {
  if (family && updatedData) {
    try {
      family.updateNode(updatedData);
      isModalUpdateOpen.value = false;
    } catch (error) {
      console.error("Lỗi khi cập nhật node vào FamilyTree:", error);
    }
  }
};

// handle search 
const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);


// tìm kiếm thành viên
const handleSearch = () => {
  const term = searchQuery.value?.trim().toLowerCase();
  if (!term || !family) return;

  const allNodesData = family.config.nodes;

  if (!allNodesData) {
    console.warn("No nodes data found in family config");
    return;
  }

  const foundMember = allNodesData.find((node: any) => {
    return node.name && node.name.toLowerCase().includes(term);
  });

  if (foundMember) {
    const nodeId = foundMember.id;

    try {
      // 1. Zoom và di chuyển đến node
      family.center(nodeId, {
        ripple: true,
        slow: true,
        // zoomState: (FamilyTree as any).zoomIn
        zoomState: 1.5,
      });

      family.search(term);

      const nodeElement = treeRef.value?.querySelector(`[data-n-id="${nodeId}"]`);
      if (nodeElement) {
        nodeElement.classList.add('found-node-highlight');
        treeRef.value?.classList.add('is-searching');
        setTimeout(() => {
          nodeElement.classList.remove('found-node-highlight');
          treeRef.value?.classList.remove('is-searching');
        }, 5000);
      }

    } catch (e) {
      console.error("Error navigating to node:", e);
      family.fit(nodeId);
    }
  } else {
    console.warn("❌ No member found for term:", term);
    // alert("Không tìm thấy thành viên: " + searchQuery.value);
    notify.error("không tin thay")
  }
};

// hiển thị gợi ý 
const searchSuggestions = computed(() => {
  const query = searchQuery.value?.trim().toLowerCase();
  if (!query || query.length < 1 || !family) return [];

  // Lấy dữ liệu từ nodes trong config
  const allNodesData = family.config.nodes;

  return allNodesData.filter((node: any) =>
    node.name && node.name.toLowerCase().includes(query)
  ).slice(0, 6);
});

// Hàm để khi nhấn vào một gợi ý thì thực hiện search luôn
const selectSuggestion = (member: any) => {
  searchQuery.value = member.name;
  handleSearch();
};


// Hàm xóa tìm kiếm - Hiển thị lại tất cả các thẻ
const clearSearch = () => {
  searchQuery.value = '';

  treeRef.value?.classList.remove('is-searching');

  treeRef.value?.querySelectorAll('.found-node-highlight').forEach(el => {
    el.classList.remove('found-node-highlight');
  });

  family.fit();

  searchInputRef.value?.focus();
};

// bật mini map
const toggleMiniMap = () => {
  isMiniMap.value = !isMiniMap.value;
  if (family) {
    family.config.miniMap = isMiniMap.value;
    family.draw();
  }
};

const isMiniMapUi = computed(() => {
  return isMiniMap.value ? 'secondary' : 'primary';
});

const resetView = () => {
  if (family) {
    family.fit();
  }
};

// quay lại danh sách gia phả
const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="flex h-screen flex-col bg-slate-50 font-sans">
    <header class="mb-2 flex items-center justify-between  bg-white p-2 shadow-sm border border-slate-200">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">
        <span class="mr-2">
        </span>Họ: Nguyễn
      </h1>

      <div class="flex gap-2">
        <div class="relative inline-block text-right">
          <ButtonBase @click="goBack" variant="primary" size="md">
            Quay trở lại
          </ButtonBase>
          <ButtonBase @click="toggleMiniMap" :variant="isMiniMapUi" size="md">
            {{ isMiniMap ? 'Tắt mini map' : 'Bật mini map' }}
          </ButtonBase>
          <ButtonBase @click="resetView" variant="primary" size="md">
            Reset mặc định
          </ButtonBase>
          <ButtonBase @click="" variant="primary" size="md">
            Gia phả trực tuyến
          </ButtonBase>

          <ButtonBase @click="" variant="primary" size="md">
            <RouterLink to="/family/xuat-file" class="">
              Xuất hình ảnh
            </RouterLink>
          </ButtonBase>
        </div>

        <!-- search   -->
        <div class="flex gap-2 ml-2 relative group">
          <div class="relative w-48">
            <input ref="" v-model="searchQuery" type="text" placeholder="Tìm tên..."
              class="border p-2 pr-8 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-amber-200 outline-none"
              @keyup.enter="handleSearch" />

            <button v-if="searchQuery" @click="clearSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div v-if="searchSuggestions.length > 0"
            class="absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-9999 mt-1 overflow-hidden">
            <div v-for="member in searchSuggestions" :key="member.id" @click="selectSuggestion(member)"
              class="px-4 py-2 hover:bg-amber-100 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-none flex items-center gap-2">
              <img :src="member.photo" class="w-6 h-6 rounded-full object-cover border border-slate-200" />
              <span class="truncate">{{ member.name }}</span>
            </div>
          </div>

          <button class="bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-lg font-bold transition-colors"
            @click="handleSearch">
            Tìm
          </button>
        </div>
      </div>
    </header>

    <!--  tree -->
    <div class="flex-1 overflow-hidden border-2 border-slate-200 shadow-inner parchment-bg">
      <div ref="treeRef" class="h-full w-full parchment-bg"></div>
    </div>

    <!--  modal -->
    <AddMemberModal :isOpen="isModalAddOpen" :member="selectedMember" @close="isModalAddOpen = false"
      @save="onSaveMember" />
    <EditMemberModal :isOpen="isModalUpdateOpen" :member="selectedMember" @close="isModalUpdateOpen = false"
      @save="onSaveMember" />
  </div>
</template>

<style scoped>
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