<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    BookOpen, Plus, ListOrdered, ArrowLeft, Info
} from 'lucide-vue-next';
import type { CeremonyRes, CeremonyTimelineRes } from '@/types/ceremony/ceremony';

// Import components
import StepModal from '@/components/family_customs/StepModal.vue';
import CeremonyCard from '@/components/family_customs/CeremonyCard.vue';
import TimelineStep from '@/components/family_customs/TimelineStep.vue';

const INITIAL_CEREMONIES: CeremonyRes[] = [
    {
        ceremonyId: 1,
        familyId: 5,
        ceremonyType: "Hỷ sự",
        ceremonyName: "Lễ Cưới Truyền Thống Việt Nam",
        description:
            "Nghi lễ cưới hỏi truyền thống Việt Nam gồm các giai đoạn dạm ngõ, ăn hỏi, xin dâu, rước dâu và lễ gia tiên. Mỗi nghi thức thể hiện sự trang trọng, lòng kính tổ tiên và sự gắn kết giữa hai gia đình.",
        timelines: [
            {
                timelineId: 1,
                ceremonyId: 1,
                stepOrder: 1,
                stepName: "Lễ Dạm Ngõ",
                stepDescription:
                    "Lễ gặp mặt chính thức đầu tiên giữa nhà trai và nhà gái. Nhà trai mang lễ vật đơn giản sang thưa chuyện, bày tỏ mong muốn cho đôi trẻ được tìm hiểu và tiến tới hôn nhân.",
                stepGuideline:
                    "Nhà trai chuẩn bị lễ vật gọn gàng, ăn mặc lịch sự, đến đúng giờ đã hẹn. Đại diện nhà trai phát biểu lý do sang thăm, nhà gái đáp lời. Hai bên cùng thắp hương gia tiên nhà gái, sau đó trao đổi về ngày ăn hỏi, ngày cưới và các nghi thức tiếp theo.",
                timelinePreparations: [
                    {
                        preparationId: 1,
                        timelineId: 1,
                        itemName: "Trầu cau",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Mâm",
                        note: "Nên chuẩn bị trầu cau tươi, trình bày đẹp, tượng trưng cho lời mở đầu chuyện hôn nhân.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 2,
                        timelineId: 1,
                        itemName: "Chè Thái Nguyên",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Hộp",
                        note: "Dùng làm lễ vật trang trọng, có thể dâng lên bàn thờ gia tiên nhà gái.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 3,
                        timelineId: 1,
                        itemName: "Rượu trắng",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Chai",
                        note: "Dùng trong phần lễ gia tiên và tiếp khách hai họ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 4,
                        timelineId: 1,
                        itemName: "Bánh kẹo",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Hộp",
                        note: "Chuẩn bị loại lịch sự, dùng để biếu nhà gái và đặt cùng mâm lễ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 5,
                        timelineId: 1,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bó",
                        note: "Dùng khi thắp hương báo cáo gia tiên nhà gái.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 6,
                        timelineId: 1,
                        itemName: "Hoa tươi",
                        itemType: "Trang trí",
                        quantity: 1,
                        unit: "Bình",
                        note: "Đặt trên bàn thờ hoặc bàn tiếp khách để không gian trang trọng hơn.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 2,
                ceremonyId: 1,
                stepOrder: 2,
                stepName: "Lễ Ăn Hỏi",
                stepDescription:
                    "Nhà trai mang sính lễ sang nhà gái để chính thức xin cưới. Đây là nghi thức quan trọng xác nhận hôn sự giữa hai gia đình.",
                stepGuideline:
                    "Đoàn nhà trai sắp xếp đội hình bê tráp, đại diện nhà trai xin phép được trao lễ. Nhà gái nhận lễ, hai bên phát biểu, cô dâu ra mắt họ hàng. Sau đó cô dâu chú rể thắp hương gia tiên nhà gái và nhà gái thực hiện nghi thức lại quả.",
                timelinePreparations: [
                    {
                        preparationId: 7,
                        timelineId: 2,
                        itemName: "Tráp trầu cau",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Tráp",
                        note: "Lễ vật quan trọng nhất, tượng trưng cho tình nghĩa vợ chồng bền chặt.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 8,
                        timelineId: 2,
                        itemName: "Tráp bánh phu thê",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Tráp",
                        note: "Biểu tượng cho sự gắn bó, thủy chung của đôi vợ chồng.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 9,
                        timelineId: 2,
                        itemName: "Tráp bánh cốm",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Tráp",
                        note: "Thường dùng trong phong tục miền Bắc, thể hiện sự ngọt ngào và đủ đầy.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 10,
                        timelineId: 2,
                        itemName: "Tráp trái cây",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Tráp",
                        note: "Nên chọn trái cây tươi, trình bày đẹp, tượng trưng cho phúc lộc và sung túc.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 11,
                        timelineId: 2,
                        itemName: "Tráp chè",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Tráp",
                        note: "Dùng để dâng gia tiên và làm quà biếu họ nhà gái.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 12,
                        timelineId: 2,
                        itemName: "Tráp rượu thuốc",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Tráp",
                        note: "Thường gồm rượu, thuốc lá hoặc vật phẩm tương đương tùy phong tục từng gia đình.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 13,
                        timelineId: 2,
                        itemName: "Phong bì sính lễ",
                        itemType: "Sính lễ",
                        quantity: 1,
                        unit: "Bộ",
                        note: "Chuẩn bị theo thỏa thuận giữa hai gia đình, đặt trang trọng trong mâm lễ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 14,
                        timelineId: 2,
                        itemName: "Khăn phủ tráp",
                        itemType: "Trang trí",
                        quantity: 6,
                        unit: "Chiếc",
                        note: "Thường dùng màu đỏ để tạo sự trang trọng và may mắn.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 3,
                ceremonyId: 1,
                stepOrder: 3,
                stepName: "Lễ Xin Dâu",
                stepDescription:
                    "Trước khi rước dâu, đại diện nhà trai sang nhà gái làm lễ xin phép được đón cô dâu về nhà chồng.",
                stepGuideline:
                    "Đại diện nhà trai mang lễ xin dâu vào nhà gái, trình bày lời xin dâu trước đại diện họ nhà gái. Nhà gái nhận lễ, đồng ý cho chú rể đón cô dâu. Sau đó cô dâu chú rể cùng làm lễ trước bàn thờ gia tiên.",
                timelinePreparations: [
                    {
                        preparationId: 15,
                        timelineId: 3,
                        itemName: "Mâm trầu cau xin dâu",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Mâm",
                        note: "Dùng riêng cho nghi thức xin dâu trước khi rước dâu.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 16,
                        timelineId: 3,
                        itemName: "Rượu lễ",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Chai",
                        note: "Đặt cùng mâm xin dâu, dùng trong phần lễ gia tiên.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 17,
                        timelineId: 3,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bó",
                        note: "Dùng cho cô dâu chú rể thắp hương trước khi rời nhà gái.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 4,
                ceremonyId: 1,
                stepOrder: 4,
                stepName: "Lễ Rước Dâu",
                stepDescription:
                    "Đoàn nhà trai đón cô dâu từ nhà gái về nhà trai, đánh dấu việc cô dâu chính thức về nhà chồng.",
                stepGuideline:
                    "Sau khi hoàn tất lễ gia tiên tại nhà gái, cô dâu chú rể chào cha mẹ, họ hàng và lên xe hoa. Đoàn rước dâu di chuyển về nhà trai theo giờ đã chọn. Khi đến nhà trai, cô dâu chú rể làm lễ ra mắt gia tiên và họ nhà trai.",
                timelinePreparations: [
                    {
                        preparationId: 18,
                        timelineId: 4,
                        itemName: "Xe hoa",
                        itemType: "Phương tiện",
                        quantity: 1,
                        unit: "Chiếc",
                        note: "Trang trí hoa cưới, dùng để chở cô dâu chú rể.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 19,
                        timelineId: 4,
                        itemName: "Hoa cưới",
                        itemType: "Trang trí",
                        quantity: 1,
                        unit: "Bó",
                        note: "Cô dâu cầm khi làm lễ và trong quá trình rước dâu.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 20,
                        timelineId: 4,
                        itemName: "Nhẫn cưới",
                        itemType: "Trang sức",
                        quantity: 2,
                        unit: "Chiếc",
                        note: "Dùng trong nghi thức trao nhẫn nếu gia đình tổ chức tại nhà.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 21,
                        timelineId: 4,
                        itemName: "Áo dài cô dâu chú rể",
                        itemType: "Trang phục",
                        quantity: 2,
                        unit: "Bộ",
                        note: "Dùng khi làm lễ gia tiên, nên chuẩn bị trước và kiểm tra kích cỡ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 5,
                ceremonyId: 1,
                stepOrder: 5,
                stepName: "Lễ Gia Tiên Nhà Trai",
                stepDescription:
                    "Cô dâu chú rể ra mắt tổ tiên nhà trai, chính thức được công nhận là vợ chồng trong gia đình.",
                stepGuideline:
                    "Gia đình nhà trai chuẩn bị bàn thờ sạch sẽ, đầy đủ lễ vật. Cô dâu chú rể thắp hương, lạy gia tiên, sau đó chào hỏi ông bà, cha mẹ và họ hàng bên nhà trai.",
                timelinePreparations: [
                    {
                        preparationId: 22,
                        timelineId: 5,
                        itemName: "Mâm ngũ quả",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Mâm",
                        note: "Đặt trên bàn thờ gia tiên, tượng trưng cho sự đủ đầy.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 23,
                        timelineId: 5,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bó",
                        note: "Dùng để cô dâu chú rể thắp hương báo cáo gia tiên.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 24,
                        timelineId: 5,
                        itemName: "Đèn cầy",
                        itemType: "Lễ nghi",
                        quantity: 2,
                        unit: "Cây",
                        note: "Thắp trên bàn thờ để tăng sự trang nghiêm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 25,
                        timelineId: 5,
                        itemName: "Rượu trắng",
                        itemType: "Lễ vật",
                        quantity: 3,
                        unit: "Chén",
                        note: "Dâng lên bàn thờ gia tiên nhà trai.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            }
        ],
        createdAt: "2026-04-12T02:44:05.336+00:00",
        updatedAt: null
    },

    {
        ceremonyId: 2,
        familyId: 5,
        ceremonyType: "Tang lễ",
        ceremonyName: "Nghi Thức Tang Lễ Truyền Thống",
        description:
            "Tang lễ truyền thống của người Việt gồm các nghi thức báo tang, khâm liệm, nhập quan, phát tang, lễ viếng, di quan, an táng và cúng sau tang. Các nghi lễ thể hiện lòng hiếu kính, sự tiễn biệt và tưởng nhớ người đã khuất.",
        timelines: [
            {
                timelineId: 6,
                ceremonyId: 2,
                stepOrder: 1,
                stepName: "Lễ Báo Tang",
                stepDescription:
                    "Gia đình thông báo tin buồn đến họ hàng, hàng xóm, bạn bè và chuẩn bị không gian tổ chức tang lễ.",
                stepGuideline:
                    "Người đại diện gia đình lập danh sách người cần báo tin, chuẩn bị bàn thờ vong, di ảnh, nhang đèn và phân công người tiếp khách. Không gian tang lễ cần được sắp xếp trang nghiêm, yên tĩnh.",
                timelinePreparations: [
                    {
                        preparationId: 26,
                        timelineId: 6,
                        itemName: "Di ảnh",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Tấm",
                        note: "Đặt chính giữa bàn thờ vong, nên chọn ảnh rõ nét và trang nghiêm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 27,
                        timelineId: 6,
                        itemName: "Bàn thờ vong",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Bộ",
                        note: "Gồm bàn, khăn phủ, lư hương, chân nến và vật phẩm thờ cúng.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 28,
                        timelineId: 6,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 2,
                        unit: "Bó",
                        note: "Dùng trong suốt thời gian tổ chức tang lễ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 29,
                        timelineId: 6,
                        itemName: "Đèn thờ",
                        itemType: "Lễ nghi",
                        quantity: 2,
                        unit: "Cây",
                        note: "Đặt hai bên bàn thờ vong, giữ không gian trang nghiêm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 7,
                ceremonyId: 2,
                stepOrder: 2,
                stepName: "Lễ Khâm Liệm",
                stepDescription:
                    "Nghi thức lau rửa, thay trang phục và chuẩn bị thi hài trước khi nhập quan.",
                stepGuideline:
                    "Người thân hoặc đội tang lễ thực hiện việc lau rửa, thay đồ, phủ vải liệm và đặt thi hài ngay ngắn. Gia đình thắp nhang, giữ sự trang nghiêm và tránh ồn ào trong quá trình thực hiện.",
                timelinePreparations: [
                    {
                        preparationId: 30,
                        timelineId: 7,
                        itemName: "Áo quan",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Chiếc",
                        note: "Quan tài cần chuẩn bị đúng kích thước, sạch sẽ và phù hợp điều kiện gia đình.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 31,
                        timelineId: 7,
                        itemName: "Vải liệm",
                        itemType: "Vật dụng",
                        quantity: 3,
                        unit: "Tấm",
                        note: "Dùng để phủ và bọc thi hài theo phong tục.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 32,
                        timelineId: 7,
                        itemName: "Quần áo liệm",
                        itemType: "Trang phục",
                        quantity: 1,
                        unit: "Bộ",
                        note: "Trang phục dành cho người mất, nên chuẩn bị sạch sẽ và trang nghiêm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 33,
                        timelineId: 7,
                        itemName: "Gối đầu",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Chiếc",
                        note: "Đặt trong áo quan theo phong tục từng gia đình.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 34,
                        timelineId: 7,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bó",
                        note: "Gia đình thắp hương trong quá trình khâm liệm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 8,
                ceremonyId: 2,
                stepOrder: 3,
                stepName: "Lễ Nhập Quan",
                stepDescription:
                    "Đưa thi hài vào áo quan và hoàn tất việc đặt linh cữu tại nơi tổ chức tang lễ.",
                stepGuideline:
                    "Gia đình thắp hương, người chủ lễ hoặc đại diện gia đình đọc lời tiễn biệt. Sau khi nhập quan, linh cữu được đặt đúng vị trí, bàn thờ vong được sắp xếp phía trước để người thân và khách viếng thắp hương.",
                timelinePreparations: [
                    {
                        preparationId: 35,
                        timelineId: 8,
                        itemName: "Linh cữu",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Bộ",
                        note: "Đặt tại vị trí trang trọng, thuận tiện cho việc viếng và di quan.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 36,
                        timelineId: 8,
                        itemName: "Khăn phủ linh cữu",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Tấm",
                        note: "Dùng để phủ bên ngoài áo quan, tạo sự trang nghiêm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 37,
                        timelineId: 8,
                        itemName: "Nến tang",
                        itemType: "Lễ nghi",
                        quantity: 2,
                        unit: "Cây",
                        note: "Đặt cạnh bàn thờ vong hoặc hai bên linh cữu.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 9,
                ceremonyId: 2,
                stepOrder: 4,
                stepName: "Lễ Phát Tang",
                stepDescription:
                    "Gia đình chính thức phát tang, con cháu mặc đồ tang theo vai vế để thể hiện lòng hiếu kính với người đã khuất.",
                stepGuideline:
                    "Người chủ lễ hoặc trưởng họ hướng dẫn con cháu nhận khăn tang, áo tang. Thứ tự phát tang thường theo vai vế trong gia đình. Sau khi phát tang, con cháu đứng đúng vị trí để đáp lễ khách viếng.",
                timelinePreparations: [
                    {
                        preparationId: 38,
                        timelineId: 9,
                        itemName: "Khăn tang",
                        itemType: "Trang phục",
                        quantity: 30,
                        unit: "Chiếc",
                        note: "Chuẩn bị theo số lượng con cháu và người thân trong gia đình.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 39,
                        timelineId: 9,
                        itemName: "Áo tang",
                        itemType: "Trang phục",
                        quantity: 20,
                        unit: "Bộ",
                        note: "Dành cho con cháu ruột hoặc người thân gần.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 40,
                        timelineId: 9,
                        itemName: "Gậy tang",
                        itemType: "Lễ nghi",
                        quantity: 2,
                        unit: "Cây",
                        note: "Dùng theo phong tục, thường dành cho con trai hoặc người chịu tang chính.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 10,
                ceremonyId: 2,
                stepOrder: 5,
                stepName: "Lễ Viếng",
                stepDescription:
                    "Người thân, họ hàng, bạn bè, hàng xóm đến thắp hương, chia buồn và tiễn biệt người đã khuất.",
                stepGuideline:
                    "Gia đình bố trí người tiếp khách, hướng dẫn khách ghi sổ tang, thắp hương và cúi lạy trước bàn thờ vong. Người thân đứng hai bên linh cữu để đáp lễ.",
                timelinePreparations: [
                    {
                        preparationId: 41,
                        timelineId: 10,
                        itemName: "Vòng hoa tang",
                        itemType: "Trang trí",
                        quantity: 10,
                        unit: "Vòng",
                        note: "Dùng để trang trí khu vực tang lễ hoặc do khách viếng gửi đến.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 42,
                        timelineId: 10,
                        itemName: "Sổ tang",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Quyển",
                        note: "Dùng để khách viếng ghi lời chia buồn.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 43,
                        timelineId: 10,
                        itemName: "Bàn tiếp khách",
                        itemType: "Vật dụng",
                        quantity: 2,
                        unit: "Bàn",
                        note: "Dùng để tiếp khách, đặt nước uống và sổ tang.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 44,
                        timelineId: 10,
                        itemName: "Nước uống",
                        itemType: "Đồ dùng",
                        quantity: 2,
                        unit: "Thùng",
                        note: "Chuẩn bị cho khách viếng và người hỗ trợ tang lễ.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 11,
                ceremonyId: 2,
                stepOrder: 6,
                stepName: "Lễ Di Quan",
                stepDescription:
                    "Đưa linh cữu rời khỏi nơi tổ chức tang lễ để đến nơi an táng hoặc hỏa táng.",
                stepGuideline:
                    "Gia đình làm lễ cáo biệt, con cháu đi theo thứ tự đã sắp xếp. Đoàn di quan cần giữ trật tự, đi đúng lộ trình và đảm bảo an toàn.",
                timelinePreparations: [
                    {
                        preparationId: 45,
                        timelineId: 11,
                        itemName: "Xe tang",
                        itemType: "Phương tiện",
                        quantity: 1,
                        unit: "Chiếc",
                        note: "Dùng để chở linh cữu đến nơi an táng hoặc hỏa táng.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 46,
                        timelineId: 11,
                        itemName: "Ảnh thờ",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Tấm",
                        note: "Người thân cầm đi trước hoặc đặt trang trọng trong đoàn di quan.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 47,
                        timelineId: 11,
                        itemName: "Hoa rải đường",
                        itemType: "Trang trí",
                        quantity: 1,
                        unit: "Túi",
                        note: "Dùng khi tiễn biệt, tùy phong tục từng gia đình.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 12,
                ceremonyId: 2,
                stepOrder: 7,
                stepName: "Lễ An Táng",
                stepDescription:
                    "Nghi thức hạ huyệt và tiễn đưa người đã khuất về nơi an nghỉ cuối cùng.",
                stepGuideline:
                    "Gia đình làm lễ tại huyệt mộ, thắp hương, đọc lời tiễn biệt, sau đó thực hiện hạ huyệt. Khi hoàn tất, người thân thắp hương lần cuối và thu dọn khu vực mộ phần.",
                timelinePreparations: [
                    {
                        preparationId: 48,
                        timelineId: 12,
                        itemName: "Huyệt mộ",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Phần",
                        note: "Cần chuẩn bị trước, đúng vị trí và đúng giờ an táng.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 49,
                        timelineId: 12,
                        itemName: "Cuốc xẻng",
                        itemType: "Vật dụng",
                        quantity: 2,
                        unit: "Bộ",
                        note: "Dùng trong quá trình lấp mộ sau khi hạ huyệt.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 50,
                        timelineId: 12,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bó",
                        note: "Thắp tại nơi an táng sau khi hoàn tất nghi thức.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 51,
                        timelineId: 12,
                        itemName: "Hoa tươi",
                        itemType: "Trang trí",
                        quantity: 1,
                        unit: "Bó",
                        note: "Đặt lên mộ sau khi hoàn tất lễ an táng.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            }
        ],
        createdAt: "2026-04-12T02:44:05.336+00:00",
        updatedAt: null
    },

    {
        ceremonyId: 3,
        familyId: 5,
        ceremonyType: "Tưởng niệm",
        ceremonyName: "Lễ Giỗ Tổ Tiên",
        description:
            "Nghi lễ tưởng nhớ tổ tiên, ông bà, cha mẹ hoặc người thân đã khuất. Lễ giỗ thể hiện lòng hiếu kính, biết ơn cội nguồn và là dịp để con cháu sum họp, gìn giữ truyền thống gia đình.",
        timelines: [
            {
                timelineId: 13,
                ceremonyId: 3,
                stepOrder: 1,
                stepName: "Dọn Dẹp Bàn Thờ",
                stepDescription:
                    "Làm sạch bàn thờ gia tiên, thay nước, lau dọn lư hương và sắp xếp lại vật phẩm thờ cúng trước ngày giỗ.",
                stepGuideline:
                    "Người trong gia đình lau bàn thờ bằng khăn sạch, thay nước, chuẩn bị bình hoa, mâm quả và kiểm tra nhang đèn. Việc dọn dẹp cần thực hiện trang nghiêm, tránh xê dịch bát hương nếu không cần thiết.",
                timelinePreparations: [
                    {
                        preparationId: 52,
                        timelineId: 13,
                        itemName: "Khăn sạch",
                        itemType: "Vật dụng",
                        quantity: 2,
                        unit: "Chiếc",
                        note: "Dùng riêng để lau bàn thờ và đồ thờ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 53,
                        timelineId: 13,
                        itemName: "Nước sạch",
                        itemType: "Lễ vật",
                        quantity: 3,
                        unit: "Chén",
                        note: "Thay nước mới trên bàn thờ gia tiên.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 54,
                        timelineId: 13,
                        itemName: "Hoa tươi",
                        itemType: "Trang trí",
                        quantity: 1,
                        unit: "Bình",
                        note: "Nên chọn hoa cúc, hoa huệ hoặc hoa lay ơn tùy phong tục gia đình.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 14,
                ceremonyId: 3,
                stepOrder: 2,
                stepName: "Chuẩn Bị Mâm Cỗ",
                stepDescription:
                    "Chuẩn bị mâm cỗ dâng lên bàn thờ gia tiên, gồm món mặn, món xôi, trái cây, rượu, trà và các lễ vật cần thiết.",
                stepGuideline:
                    "Mâm cỗ nên được chuẩn bị sạch sẽ, bày biện cân đối và đặt lên bàn thờ trước giờ cúng. Tùy vùng miền, gia đình có thể chuẩn bị cỗ mặn hoặc cỗ chay.",
                timelinePreparations: [
                    {
                        preparationId: 55,
                        timelineId: 14,
                        itemName: "Gà luộc",
                        itemType: "Món ăn",
                        quantity: 1,
                        unit: "Con",
                        note: "Thường đặt nguyên con trên mâm cỗ, đầu quay về phía bát hương tùy phong tục.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 56,
                        timelineId: 14,
                        itemName: "Xôi gấc",
                        itemType: "Món ăn",
                        quantity: 1,
                        unit: "Đĩa",
                        note: "Biểu tượng cho sự may mắn, đủ đầy và trang trọng.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 57,
                        timelineId: 14,
                        itemName: "Canh",
                        itemType: "Món ăn",
                        quantity: 1,
                        unit: "Tô",
                        note: "Có thể dùng canh măng, canh bóng, canh rau củ hoặc món truyền thống của gia đình.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 58,
                        timelineId: 14,
                        itemName: "Món xào",
                        itemType: "Món ăn",
                        quantity: 1,
                        unit: "Đĩa",
                        note: "Bổ sung cho mâm cỗ thêm đầy đủ và cân đối.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 59,
                        timelineId: 14,
                        itemName: "Trái cây ngũ quả",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Mâm",
                        note: "Có thể gồm chuối, bưởi, cam, táo, lê hoặc các loại quả theo vùng miền.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 60,
                        timelineId: 14,
                        itemName: "Rượu trắng",
                        itemType: "Lễ vật",
                        quantity: 3,
                        unit: "Chén",
                        note: "Dâng lên tổ tiên trong phần cúng chính.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 61,
                        timelineId: 14,
                        itemName: "Trà",
                        itemType: "Lễ vật",
                        quantity: 3,
                        unit: "Chén",
                        note: "Đặt cạnh rượu hoặc nước sạch trên bàn thờ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 15,
                ceremonyId: 3,
                stepOrder: 3,
                stepName: "Thắp Hương Gia Tiên",
                stepDescription:
                    "Con cháu thắp hương kính mời tổ tiên, ông bà, cha mẹ hoặc người thân đã khuất về hưởng lễ.",
                stepGuideline:
                    "Trưởng họ hoặc người đại diện gia đình ăn mặc chỉnh tề, thắp hương, đọc lời khấn. Con cháu đứng nghiêm trang phía sau, lần lượt thắp hương sau khi người đại diện hoàn tất.",
                timelinePreparations: [
                    {
                        preparationId: 62,
                        timelineId: 15,
                        itemName: "Nhang",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bó",
                        note: "Dùng để thắp trên bàn thờ trong suốt buổi lễ.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 63,
                        timelineId: 15,
                        itemName: "Đèn cầy",
                        itemType: "Lễ nghi",
                        quantity: 2,
                        unit: "Cây",
                        note: "Thắp hai bên bàn thờ để tạo sự trang nghiêm.",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 64,
                        timelineId: 15,
                        itemName: "Văn khấn",
                        itemType: "Lễ nghi",
                        quantity: 1,
                        unit: "Bài",
                        note: "Chuẩn bị lời khấn phù hợp với ngày giỗ và vai vế người được cúng.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            },
            {
                timelineId: 16,
                ceremonyId: 3,
                stepOrder: 4,
                stepName: "Hóa Vàng Và Tạ Lễ",
                stepDescription:
                    "Sau khi hương gần tàn, gia đình làm lễ tạ, hóa vàng mã và kết thúc phần cúng gia tiên.",
                stepGuideline:
                    "Người đại diện gia đình khấn xin hạ lễ, sau đó đem vàng mã đi hóa ở nơi an toàn. Khi hóa vàng xong, gia đình vái tạ và hạ mâm cỗ để con cháu cùng thụ lộc.",
                timelinePreparations: [
                    {
                        preparationId: 65,
                        timelineId: 16,
                        itemName: "Vàng mã",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Bộ",
                        note: "Chuẩn bị tùy theo phong tục gia đình, không nên lạm dụng quá nhiều.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 66,
                        timelineId: 16,
                        itemName: "Lư hóa vàng",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Cái",
                        note: "Dùng để hóa vàng an toàn, tránh cháy lan.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 67,
                        timelineId: 16,
                        itemName: "Nước sạch",
                        itemType: "Vật dụng",
                        quantity: 1,
                        unit: "Xô",
                        note: "Chuẩn bị gần khu vực hóa vàng để đảm bảo an toàn.",
                        required: false,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: null
            }
        ],
        createdAt: "2026-04-12T02:44:05.336+00:00",
        updatedAt: null
    }
];
// --- STATE ---
const ceremonies = ref<CeremonyRes[]>(INITIAL_CEREMONIES);
const selectedCeremonyId = ref<number | null>(null);
const showStepModal = ref(false);
const editingStep = ref<CeremonyTimelineRes | null>(null);

// --- COMPUTED ---
const selectedCeremony = computed(() =>
    ceremonies.value.find(c => c.ceremonyId === selectedCeremonyId.value)
);

const currentSteps = computed(() => {
    if (!selectedCeremony.value) return [];
    return [...selectedCeremony.value.timelines].sort((a, b) => a.stepOrder - b.stepOrder);
});

// --- METHODS ---
const goBack = () => selectedCeremonyId.value = null;

const openModal = (step: CeremonyTimelineRes | null = null) => {
    editingStep.value = step;
    showStepModal.value = true;
};

const handleSaveStep = (stepData: Partial<CeremonyTimelineRes>) => {
    if (!selectedCeremonyId.value) return;

    const ceremonyIndex = ceremonies.value.findIndex(c => c.ceremonyId === selectedCeremonyId.value);
    if (ceremonyIndex === -1) return;

    const ceremony = ceremonies.value[ceremonyIndex];
    let newTimelines = [...ceremony.timelines];

    if (editingStep.value) {
        // Update
        newTimelines = newTimelines.map(t =>
            t.timelineId === editingStep.value!.timelineId ? { ...t, ...stepData } as CeremonyTimelineRes : t
        );
    } else {
        // Add new
        const maxOrder = currentSteps.value.length > 0 ? Math.max(...currentSteps.value.map(s => s.stepOrder)) : 0;
        const newStep: CeremonyTimelineRes = {
            ...stepData,
            timelineId: Date.now(),
            ceremonyId: selectedCeremonyId.value,
            stepOrder: maxOrder + 1,
            timelinePreparations: stepData.timelinePreparations || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as CeremonyTimelineRes;
        newTimelines.push(newStep);
    }

    ceremonies.value[ceremonyIndex].timelines = newTimelines;
    showStepModal.value = false;
    editingStep.value = null;
};

const deleteStep = (timelineId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bước này?')) return;

    const ceremonyIndex = ceremonies.value.findIndex(c => c.ceremonyId === selectedCeremonyId.value);
    if (ceremonyIndex === -1) return;

    const remainingSteps = ceremonies.value[ceremonyIndex].timelines.filter(t => t.timelineId !== timelineId);
    ceremonies.value[ceremonyIndex].timelines = remainingSteps
        .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
        .map((s: any, idx: any) => ({ ...s, stepOrder: idx + 1 }));
};
</script>

<template>
    <div class="min-h-screen bg-white text-slate-900 selection:bg-slate-100 selection:text-slate-900">

        <StepModal :show="showStepModal" :editing-step="editingStep" @close="showStepModal = false"
            @save="handleSaveStep" />

        <header
            class="max-w-full mx-auto pt-10 px-4 mb-12 text-slate-900 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/50">
            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
                    <div v-if="!selectedCeremonyId" class="flex items-center gap-6">
                        <div class="p-3 bg-slate-700 rounded-lg shadow-2xl shadow-slate-700/20">
                            <BookOpen class="text-white w-8 h-8" />
                        </div>
                        <div>
                            <span
                                class="block text-[9px] font-bold  text-slate-600 uppercase tracking-[0.3em] mb-1 opacity-50">Hệ
                                thống quản lý nghi thức</span>
                            <h1 class="text-4xl font-semibold tracking-tight leading-none">
                                Chi tiết <span class="italic text-slate-600">Nghi Lễ</span>
                            </h1>
                        </div>
                    </div>

                    <!-- Detail Header -->
                    <div v-else class="flex items-center gap-8 flex-1">
                        <div class="flex items-center gap-6 flex-1">
                            <div
                                class="p-4 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl shadow-slate-700/30">
                                <ListOrdered class="text-white w-8 h-8" />
                            </div>
                            <div class="flex-1">
                                <span
                                    class="block text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-1 opacity-60">Xem
                                    chi tiết nghi thức</span>
                                <h1 class="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900">
                                    {{ selectedCeremony?.ceremonyName }}
                                </h1>
                                <p class="text-sm text-slate-600 mt-2 leading-relaxed">
                                    {{ selectedCeremony?.description }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div v-if="selectedCeremonyId" class="flex items-center gap-3 mr-4">
                            <div class="text-right">
                                <p class="text-[10px] uppercase font-bold text-slate-600 opacity-50">Quản lý bởi</p>
                                <p class="text-sm font-bold text-slate-900 opacity-80">Vũ Văn (ID: 5)</p>
                            </div>
                            <div
                                class="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white shadow-md flex items-center justify-center text-lg font-bold text-slate-700">
                                V</div>
                        </div>
                        <button v-if="selectedCeremonyId" @click="goBack"
                            class="group flex items-center gap-2 bg-white px-6 py-2.5 rounded-lg font-bold text-slate-700 border border-slate-300 shadow-sm hover:shadow-lg hover:border-slate-400 transition-all active:scale-95 text-[9px] uppercase tracking-widest">
                            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Quay lại
                        </button>
                        <button v-else
                            class="flex items-center gap-2 bg-slate-700 text-white border-slate-800 cursor-pointer px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-slate-700/20 hover:bg-slate-600 transition-all active:scale-95 text-[9px] uppercase tracking-widest">
                            <Plus class="w-5 h-5" /> Thêm phong tục
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-full mx-auto px-4 pb-12">
            <div class="max-w-6xl mx-auto">
                <Transition mode="out-in" enter-active-class="transform transition duration-600 ease-out"
                    enter-from-class="opacity-0 translate-y-12" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transform transition duration-400 ease-in"
                    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-12">
                    <!-- LIST VIEW -->
                    <div v-if="!selectedCeremonyId" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CeremonyCard v-for="ceremony in ceremonies" :key="ceremony.ceremonyId" :ceremony="ceremony"
                            @select="id => selectedCeremonyId = id" />
                    </div>

                    <!-- DETAIL VIEW -->
                    <div v-else class="w-full">
                        <div class="space-y-6">
                            <div
                                class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="p-2.5 bg-slate-700 rounded-lg shadow-lg">
                                            <ListOrdered class="text-white w-6 h-6" />
                                        </div>
                                        <h3 class="text-2xl font-bold text-slate-900">
                                            Tiến trình thực hiện
                                        </h3>
                                    </div>
                                    <p class="text-sm text-slate-600 ml-11">Tổng cộng: <span
                                            class="font-bold text-slate-900">{{ currentSteps.length }} bước</span></p>
                                </div>
                                <button @click="openModal()"
                                    class="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white cursor-pointer px-7 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-slate-700/30 hover:shadow-xl">
                                    <Plus class="w-5 h-5" /> Thêm bước
                                </button>
                            </div>

                            <div v-if="currentSteps.length === 0"
                                class="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-20 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center shadow-sm">
                                <div
                                    class="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-8 shadow-md">
                                    <Info class="w-12 h-12 text-slate-400" />
                                </div>
                                <h4 class="text-slate-600 font-bold uppercase tracking-[0.4em] text-sm mb-3">Chưa có
                                    bước nào</h4>
                                <p class="text-slate-500 text-base font-medium mb-8 max-w-sm">Hãy bắt đầu xây dựng lộ
                                    trình chi tiết cho nghi lễ "<span
                                        class="font-bold text-slate-900">{{ selectedCeremony?.ceremonyName }}</span>"
                                    này.</p>
                                <button @click="openModal()"
                                    class="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white cursor-pointer px-8 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-slate-700/30">
                                    <Plus class="w-5 h-5" /> Tạo bước đầu tiên
                                </button>
                            </div>

                            <div v-else class="space-y-6 relative">
                                <TimelineStep v-for="(step, index) in currentSteps" :key="step.timelineId" :step="step"
                                    :is-last="index === currentSteps.length - 1" @edit="openModal"
                                    @delete="deleteStep" />

                                <div class="flex items-center gap-8 py-8 px-6 opacity-30">
                                    <div class="w-4 h-4 rounded-full bg-slate-600"></div>
                                    <div class="h-0.5 bg-slate-600 grow rounded-full"></div>
                                    <span class="text-slate-600 font-bold uppercase tracking-[0.4em] text-[9px]">Hoàn
                                        tất
                                        tiến độ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </main>
    </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a2820;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3a3a2840;
}
</style>
