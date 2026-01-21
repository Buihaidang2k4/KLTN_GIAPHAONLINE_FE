<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import FamilyTree from "@balkangraph/familytree.js";
import EditMemberModal from "@/components/family_tree/EditMemberModal.vue";

const treeRef = ref<HTMLDivElement | null>(null);
const isModalOpen = ref(false);
const selectedMember = ref<any>(null);
let family: any = null;

onMounted(() => {
  if (treeRef.value) {
    FamilyTree.templates.john = Object.assign({}, FamilyTree.templates.base);
    FamilyTree.templates.john.size = [160, 170];
    FamilyTree.templates.john.node =
      '<rect x="0" y="0" height="170" width="160" fill="#F2F6FB" stroke-width="1.5" stroke="#4A6FA5" rx="10" ry="10"></rect>' +
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

    // hiển thị đời thứ mấy 
    // FamilyTree.templates.john.val = '{generation}'; // XÓA DÒNG NÀY VÌ SAI CÚ PHÁP

    // node màu nữ
    FamilyTree.templates.jane = Object.assign({}, FamilyTree.templates.john);
    FamilyTree.templates.jane.node =
      '<rect x="0" y="0" height="170" width="160" fill="#FAF3F1" stroke-width="1.5" stroke="#B07A6A" rx="10" ry="10"></rect>' +
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
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
        },
        viewChildren: {
          text: "Xem đời sau",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="23 13 23 17 19 17"/><path d="M23 13l-4 4"/></svg>'
        },
        focus: {
          text: "Trở về gốc",
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
          icon: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          `
        },
        edit: {
          text: "Chỉnh sửa",
          onClick: (nodeId: any) => {
            const rawData = family.get(nodeId);
            if (rawData) {
              selectedMember.value = structuredClone(rawData);
              isModalOpen.value = true;
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

      // hiển thị match theo chiều gì 
      scaleInitial: FamilyTree.match.width,
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

    } as any);

    const myData: any[] = [
      // THẾ HỆ 1: THỦY TỔ (2 người)
      { id: "1", pids: ["2"], generation: "1", name: "Nguyễn Văn Tâm", title: "1940", gender: "male", photo: "https://cdn.balkan.app/shared/m60/1.jpg" },
      { id: "2", pids: ["1"], generation: "1", name: "Lê Thị Thanh", title: "1945", gender: "female", photo: "https://cdn.balkan.app/shared/w60/1.jpg" },

      // THẾ HỆ 2: CÁC CON CỦA CỤ TÂM (8 người - 3 cặp vợ chồng + 2 người độc thân)
      { id: "3", fid: "1", mid: "2", pids: ["4"], generation: "2", name: "Nguyễn Quang", title: "1965", gender: "male", photo: "https://cdn.balkan.app/shared/m60/2.jpg" },
      { id: "4", pids: ["3"], generation: "2", name: "Hoàng Mỹ", title: "1968", gender: "female", photo: "https://cdn.balkan.app/shared/w60/2.jpg" },

      { id: "5", fid: "1", mid: "2", pids: ["6"], generation: "2", name: "Nguyễn Hùng", title: "1970", gender: "male", photo: "https://cdn.balkan.app/shared/m60/3.jpg" },
      { id: "6", pids: ["5"], generation: "2", name: "Phan Lan", title: "1972", gender: "female", photo: "https://cdn.balkan.app/shared/w60/3.jpg" },

      { id: "7", fid: "1", mid: "2", pids: ["8"], generation: "2", name: "Nguyễn Mai", title: "1975", gender: "female", photo: "https://cdn.balkan.app/shared/w30/1.jpg" },
      { id: "8", pids: ["7"], generation: "2", name: "Trần Thế", title: "1973", gender: "male", photo: "https://cdn.balkan.app/shared/m30/1.jpg" },

      { id: "9", fid: "1", mid: "2", generation: "2", name: "Nguyễn Tuấn", title: "1978", gender: "male", photo: "https://cdn.balkan.app/shared/m30/2.jpg" },
      { id: "10", fid: "1", mid: "2", generation: "2", name: "Nguyễn Thu", title: "1982", gender: "female", photo: "https://cdn.balkan.app/shared/w30/2.jpg" },

      // THẾ HỆ 3: CÁC CHÁU NỘI/NGOẠI (12 người)
      // Con của ông Quang (id 3-4)
      { id: "11", fid: "3", mid: "4", pids: ["12"], generation: "3", name: "Nguyễn Anh", title: "1990", gender: "male", photo: "https://cdn.balkan.app/shared/m30/5.jpg" },
      { id: "12", pids: ["11"], generation: "3", name: "Lê Ngọc", title: "1992", gender: "female", photo: "https://cdn.balkan.app/shared/w30/5.jpg" },
      { id: "13", fid: "3", mid: "4", generation: "3", name: "Nguyễn Bảo", title: "1995", gender: "male", photo: "https://cdn.balkan.app/shared/m30/6.jpg" },

      // Con của ông Hùng (id 5-6)
      { id: "14", fid: "5", mid: "6", pids: ["15"], generation: "3", name: "Nguyễn Cường", title: "1993", gender: "male", photo: "https://cdn.balkan.app/shared/m30/7.jpg" },
      { id: "15", pids: ["14"], generation: "3", name: "Đỗ Quyên", title: "1995", gender: "female", photo: "https://cdn.balkan.app/shared/w30/7.jpg" },
      { id: "16", fid: "5", mid: "6", generation: "3", name: "Nguyễn Diệu", title: "1998", gender: "female", photo: "https://cdn.balkan.app/shared/w30/8.jpg" },

      // Con của bà Mai (id 7-8 - Cháu ngoại)
      { id: "17", fid: "8", mid: "7", pids: ["18"], generation: "3", name: "Trần Long", title: "1996", gender: "male", photo: "https://cdn.balkan.app/shared/m30/8.jpg" },
      { id: "18", pids: ["17"], generation: "3", name: "Vũ Hạ", title: "1998", gender: "female", photo: "https://cdn.balkan.app/shared/w30/9.jpg" },
      { id: "19", fid: "8", mid: "7", generation: "3", name: "Trần Yến", title: "2000", gender: "female", photo: "https://cdn.balkan.app/shared/w10/1.jpg" },

      // Con của ông Tuấn (id 9 - mới lấy vợ)
      { id: "20", pids: ["21"], generation: "3", name: "Nguyễn Tuấn", title: "1978", gender: "male", photo: "https://cdn.balkan.app/shared/m30/2.jpg" }, // Trùng id 9, đã sửa thành 20
      { id: "21", pids: ["20"], generation: "3", name: "Bùi Kim", title: "1985", gender: "female", photo: "https://cdn.balkan.app/shared/w30/10.jpg" },
      { id: "22", fid: "20", mid: "21", generation: "3", name: "Nguyễn Khôi", title: "2010", gender: "male", photo: "https://cdn.balkan.app/shared/m10/1.jpg" },

      // Con của Nguyễn Anh (id 11-12)
      { id: "23", fid: "11", mid: "12", generation: "4", name: "Nguyễn Minh", title: "2015", gender: "male", photo: "https://cdn.balkan.app/shared/m10/2.jpg" },
      { id: "24", fid: "11", mid: "12", generation: "4", name: "Nguyễn An", title: "2018", gender: "female", photo: "https://cdn.balkan.app/shared/w10/2.jpg" },

      // Con của Nguyễn Cường (id 14-15)
      { id: "25", fid: "14", mid: "15", generation: "4", name: "Nguyễn Bình", title: "2020", gender: "male", photo: "https://cdn.balkan.app/shared/m10/3.jpg" },
      { id: "26", fid: "14", mid: "15", generation: "4", name: "Nguyễn Ca", title: "2022", gender: "female", photo: "https://cdn.balkan.app/shared/w10/3.jpg" },

      // Con của Trần Long (id 17-18)
      { id: "27", fid: "17", mid: "18", generation: "4", name: "Trần Đăng", title: "2019", gender: "male", photo: "https://cdn.balkan.app/shared/m10/4.jpg" },
      { id: "28", fid: "17", mid: "18", generation: "4", name: "Trần Giao", title: "2021", gender: "female", photo: "https://cdn.balkan.app/shared/w10/4.jpg" },

      // THẾ HỆ 5: ĐỜI ÚT (2 người)
      { id: "29", fid: "23", generation: "5", name: "Nguyễn GenZ", title: "2038", gender: "male", photo: "https://cdn.balkan.app/shared/m10/5.jpg" },
      { id: "30", fid: "23", generation: "5", name: "Nguyễn Alpha", title: "2040", gender: "female", photo: "https://cdn.balkan.app/shared/w10/5.jpg" }
    ];

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
    family.on("click", (_sender: any, args: any) => {

      if (args.event.target.classList.contains('menu-button') || args.event.target.closest('.menu-button')) {
        return;
      }

      args.cancel = true;

      const nodeId = args.node?.id as any;
      // Kiểm tra dữ liệu node trong args
      if (!nodeId) {
        console.warn("Không có nodeId trong args:", args);
        return;
      }

      // Lấy dữ liệu node từ cây
      const rawData = family.get(nodeId);
      if (rawData) {
        selectedMember.value = structuredClone(rawData);

        isModalOpen.value = true;
      } else {
        console.warn("Không tìm thấy dữ liệu cho node:", nodeId);
      }
    });

  }
});

// save member
const onSaveMember = (updatedData: any) => {
  if (family && updatedData) {
    try {
      // Gọi lệnh cập nhật của thư viện
      family.updateNode(updatedData);
      isModalOpen.value = false;
    } catch (error) {
      console.error("Lỗi khi cập nhật node vào FamilyTree:", error);
    }
  }
};

// handle search 
const searchQuery = ref("");

const handleSearch = () => {
  const term = searchQuery.value?.trim().toLowerCase();
  if (!term || !family) return;

  // Tìm trong mảng nodes gốc được truyền vào cấu hình
  const allNodesData = family.config.nodes;

  if (!allNodesData) {
    console.warn("No nodes data found in family config");
    return;
  }

  // Tìm thành viên có tên chứa từ khóa
  const foundMember = allNodesData.find((node: any) => {
    return node.name && node.name.toLowerCase().includes(term);
  });

  if (foundMember) {
    const nodeId = foundMember.id;

    try {
      // 1. Zoom và di chuyển đến node
      family.center(nodeId, {
        ripple: true,
        zoomState: (FamilyTree as any).zoomIn
      });

      // 2. Kích hoạt highlight đỏ của thư viện (giúp viền đỏ giữ lâu hơn)
      family.search(term);

      // 3. Thêm hiệu ứng nháy CSS thủ công để cực kỳ nổi bật
      const nodeElement = treeRef.value?.querySelector(`[data-n-id="${nodeId}"]`);
      if (nodeElement) {
        nodeElement.classList.add('found-node-highlight');
        // Xóa hiệu ứng sau 5 giây để không làm rối mắt
        setTimeout(() => {
          nodeElement.classList.remove('found-node-highlight');
        }, 5000);
      }

    } catch (e) {
      console.error("Error navigating to node:", e);
      family.fit(nodeId);
    }
  } else {
    console.warn("❌ No member found for term:", term);
    alert("Không tìm thấy thành viên: " + searchQuery.value);
  }
};

// hiển thị gợi ý 
const searchSuggestions = computed(() => {
  const query = searchQuery.value?.trim().toLowerCase();
  if (!query || query.length < 1 || !family) return [];

  // Lấy dữ liệu từ nodes trong config
  const allNodesData = family.config.nodes;

  // Trả về tối đa 5-8 kết quả chứa từ khóa
  return allNodesData.filter((node: any) =>
    node.name && node.name.toLowerCase().includes(query)
  ).slice(0, 6);
});

// Hàm để khi nhấn vào một gợi ý thì thực hiện search luôn
const selectSuggestion = (member: any) => {
  searchQuery.value = member.name;
  handleSearch(); // Chạy hàm search ngon lành của bạn
};

//  droppdown export gia pha 
const isExportMenuOpen = ref(false);

// Hàm để đóng menu sau khi chọn một chức năng
const runExport = (type: string) => {
  if (!family) return;

  if (type === 'pdf') family.exportPDF({ filename: "Gia-pha.pdf" });
  if (type === 'png') family.exportPNG({ filename: "Gia-pha.png" });
  if (type === 'csv') family.exportCSV({ filename: "Gia-pha.csv" });
  if (type === 'svg') family.exportSVG({ filename: "Gia-pha.svg" });

  isExportMenuOpen.value = false; // Đóng menu
};

</script>

<template>
  <div class="flex  h-screen flex-col bg-slate-50 p-6 font-sans">
    <header class="mb-6 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-200">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight">
        GIA PHẢ DÒNG HỌ
      </h1>
      <div class="flex gap-4 text-xs font-bold">
        <span class="flex items-center gap-1"><i class="w-3 h-3 bg-blue-500 rounded-full"></i> NAM</span>
        <span class="flex items-center gap-1"><i class="w-3 h-3 bg-pink-500 rounded-full"></i> NỮ</span>
      </div>
      <RouterLink to="/dashboard" class="border p-3 bg-amber-200 rounded-xl">Dashboard</RouterLink>


      <div class="flex gap-2">
        <!--  export gia pha -->
        <div class="relative inline-block text-left">
          <button @click="isExportMenuOpen = !isExportMenuOpen"
            class="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Xuất gia phả
          </button>


          <!-- export file -->
          <div v-if="isExportMenuOpen" @click="isExportMenuOpen = false" class="fixed inset-0 z-10"></div>

          <div v-if="isExportMenuOpen"
            class="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-100 py-2 z-20 overflow-hidden">
            <button @click="runExport('pdf')"
              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors">
              <span class="font-bold text-red-500">PDF</span> Xuất file tài liệu
            </button>

            <button @click="runExport('png')"
              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-y border-slate-50">
              <span class="font-bold text-blue-500">PNG</span> Xuất file hình ảnh
            </button>

            <button @click="runExport('svg')"
              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors">
              <span class="font-bold text-green-500">SVG</span> Xuất file SVG
            </button>

            <button @click="runExport('csv')"
              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors">
              <span class="font-bold text-green-500">CSV</span> Xuất file Excel
            </button>

          </div>
        </div>

        <!-- search   -->
        <div class="flex gap-2 ml-2 relative group"> <input v-model="searchQuery" type="text" placeholder="Tìm tên..."
            class="border p-2 rounded-lg w-48 shadow-sm focus:ring-2 focus:ring-black-200 outline-none"
            @keyup.enter="handleSearch" />

          <div v-if="searchSuggestions.length > 0"
            class="absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] mt-1 overflow-hidden">
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
    <div class="flex-1 overflow-hidden rounded-[2.5rem] border-2 border-slate-200 shadow-inner parchment-bg">
      <div ref="treeRef" class="h-full w-full"></div>
    </div>

    <!--  modal -->
    <EditMemberModal :isOpen="isModalOpen" :member="selectedMember" @close="isModalOpen = false" @save="onSaveMember" />
  </div>
</template>

<style>
/* Ẩn thanh công cụ mặc định (Search.) */
[data-ctrl-menu],
.bft-control-container,
.bft-search {
  display: none !important;
}

.parchment-bg {
  background-color: #fcf5e5;
  background-image: url("https://www.transparenttextures.com/patterns/parchment.png");
  /* Bạn có thể thay đổi URL ảnh nền tại đây */
  background-repeat: repeat;
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
.is-searching [data-n-id] {
  opacity: 0.35;
  transition: opacity 0.6s ease;
}

/* 2. Node được tìm thấy giữ độ rõ nét 100% */
.is-searching [data-n-id].found-node-highlight {
  opacity: 1;
}

/* 3. Chỉ hiệu ứng viền cho khung hình chữ nhật chính (khung ngoài cùng) */
.found-node-highlight>rect:first-child {
  stroke: #007bff !important;
  stroke-width: 2px !important;
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

/* Hiệu ứng khi di chuột vào "cái hoa" */
.bft-button:hover circle {
  fill: #fef3c7 !important;
  /* Đổi màu nền nhẹ khi hover */
  stroke: #B71C1C !important;
}
</style>