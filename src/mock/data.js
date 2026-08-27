import syncedVideos from './syncedVideos.json';

// MechanicalBKA Mock Data - Phase 1 Final QA
// Thiết kế khớp 1:1 với Firestore Schema trong MECHANICALBKA_V1_ARCHITECTURE_FINAL.md

export const specialties = [
  {
    id: "spec_polymer_composite",
    name: "Polymer & Composite",
    slug: "polymer-composite",
    description: "Lý thuyết cơ học polymer, khoa học vật liệu nhựa và quy trình chế tạo composite hiện đại.",
    order: 1,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  },
  {
    id: "spec_mold_design",
    name: "Mold Design (Thiết kế Khuôn)",
    slug: "mold-design",
    description: "Kỹ thuật thiết kế khuôn ép phun nhựa, khuôn dập tấm và tối ưu hóa hệ thống lòng khuôn.",
    order: 2,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  },
  {
    id: "spec_manufacturing",
    name: "Mechanical Manufacturing",
    slug: "mechanical-manufacturing",
    description: "Công nghệ chế tạo máy, lập trình gia công CNC và tối ưu công cụ cắt gọt.",
    order: 3,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  },
  {
    id: "spec_cad_cae",
    name: "CAD / CAE",
    slug: "cad-cae",
    description: "Dựng hình cơ khí 3D và mô phỏng số học (CAE) dòng chảy, ứng suất cơ học vật lý.",
    order: 4,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  }
];

export const software = [
  {
    id: "soft_inventor",
    name: "Autodesk Inventor",
    slug: "autodesk-inventor",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    description: "Dựng hình cơ khí 3D tham số, lắp ráp máy và thiết kế sản phẩm nâng cao.",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  },
  {
    id: "soft_mold_design",
    name: "Mold Design Inventor",
    slug: "mold-design-inventor",
    logoUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=60",
    description: "Công cụ thiết kế vỏ khuôn (Mold Base) và hệ thống đẩy/làm mát khuôn nhựa.",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  },
  {
    id: "soft_solidworks",
    name: "SOLIDWORKS",
    slug: "solidworks",
    logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=60",
    description: "Thiết kế máy cơ khí công nghiệp, xuất bản vẽ 2D và lắp ráp cụm chi tiết lớn.",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  },
  {
    id: "soft_xtimon",
    name: "X-TIMON",
    slug: "x-timon",
    logoUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=100&auto=format&fit=crop&q=60",
    description: "Mô phỏng CAE quá trình điền đầy dòng chảy nhựa nóng chảy và phân tích khuyết tật sản phẩm.",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T08:00:00Z"
  }
];

export const courses = [
  {
    id: "course_inventor_mold_basics",
    title: "Thiết kế Khuôn cơ bản trên Autodesk Inventor",
    slug: "thiet-ke-khuon-co-ban-inventor",
    description: "Khóa học này hướng dẫn chi tiết quy trình tách lòng khuôn cơ bản (Core & Cavity), nạp sản phẩm nhựa, tạo góc thoát khuôn và thiết kế bạc cuống phun cho các sản phẩm cơ khí thông dụng.",
    thumbnailUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=600&auto=format&fit=crop&q=80",
    specialtyIds: ["spec_mold_design", "spec_cad_cae"],
    softwareIds: ["soft_inventor", "soft_mold_design"],
    price: 250000,
    accessType: "PAID",
    level: "Cơ bản",
    isPublished: true,
    isFeatured: true,
    metaTitle: "Học thiết kế khuôn ép nhựa cơ bản với Inventor",
    metaDescription: "Khóa học hướng dẫn tách Core & Cavity khuôn nhựa bằng Autodesk Inventor chi tiết cho sinh viên và kỹ sư mới.",
    lastEditorUid: "usr_admin_001",
    createdAt: "2026-08-20T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "course_inventor_mold_adv",
    title: "Thiết kế Khuôn mẫu nâng cao: Slider và Lifter",
    slug: "thiet-ke-khuon-nang-cao-slider-lifter",
    description: "Nội dung nâng cao tập trung vào giải quyết các chi tiết nhựa có Under-cut (hốc âm). Học viên sẽ học cách thiết kế cơ cấu trượt Slider (con trượt) và Lifter (chốt xiên) đẩy lòng khuôn phức tạp.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    specialtyIds: ["spec_mold_design"],
    softwareIds: ["soft_inventor", "soft_mold_design"],
    price: 450000,
    accessType: "PAID",
    level: "Nâng cao",
    isPublished: true,
    isFeatured: true,
    metaTitle: "Khóa học thiết kế khuôn nâng cao Slider và Lifter",
    metaDescription: "Thiết kế cơ cấu Slider, Lifter, lõi trượt nghiêng cho khuôn ép phun nhựa hốc âm phức tạp.",
    lastEditorUid: "usr_admin_001",
    createdAt: "2026-08-22T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "course_solidworks_machine",
    title: "Thiết kế Chi tiết máy công nghiệp với SOLIDWORKS",
    slug: "thiet-ke-chi-tiet-may-solidworks",
    description: "Khóa học thực hành dựng hình các chi tiết máy tiêu chuẩn (bánh răng, xích, trục khuỷu) và lắp ráp cụm hệ thống truyền động cơ khí. Tối ưu hóa dung sai lắp ghép và xuất bản vẽ kỹ thuật 2D tiêu chuẩn ISO.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&auto=format&fit=crop&q=80",
    specialtyIds: ["spec_manufacturing", "spec_cad_cae"],
    softwareIds: ["soft_solidworks"],
    price: 300000,
    accessType: "PAID",
    level: "Cơ bản",
    isPublished: true,
    isFeatured: true,
    metaTitle: "Thiết kế chi tiết máy cơ khí SOLIDWORKS chuyên nghiệp",
    metaDescription: "Khóa học truyền động cơ khí, thiết kế chi tiết máy tiêu chuẩn và xuất bản vẽ 2D với SolidWorks.",
    lastEditorUid: "usr_admin_001",
    createdAt: "2026-08-24T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "course_polymer_mechanics",
    title: "Cơ chất lỏng Polymer & Quy trình Đùn ép nhựa",
    slug: "co-chat-long-polymer-va-quy-trinh-dun",
    description: "Cung cấp kiến thức học thuật chuyên sâu về trạng thái chảy dẻo của polymer, cơ chất lỏng phi Newton, phân tích ứng suất cắt, dòng chảy nhựa trong kênh dẫn đầu đùn và tối ưu nhiệt độ sản xuất nhựa định hình.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    specialtyIds: ["spec_polymer_composite"],
    softwareIds: [],
    price: 0,
    accessType: "FREE",
    level: "Trung cấp",
    isPublished: true,
    isFeatured: false,
    metaTitle: "Cơ chất lỏng Polymer và công nghệ đùn ép nhựa định hình",
    metaDescription: "Tìm hiểu lý thuyết dòng chảy chất lỏng polymer phi Newton và công nghệ sản xuất nhựa đùn, ép khuôn.",
    lastEditorUid: "usr_admin_002",
    createdAt: "2026-08-25T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "course_xtimon_flow",
    title: "Mô phỏng Dòng chảy khuôn nhựa với X-TIMON",
    slug: "mo-phong-dong-chay-khuon-nhua-xtimon",
    description: "Làm chủ phần mềm CAE X-TIMON để mô phỏng dòng nhựa nóng điền đầy cavity. Phân tích các lỗi nghiêm trọng như thiếu liệu (Short Shot), đường hàn nhựa (Weld Line), bẫy khí (Air Trap) và tối ưu hóa vị trí cổng phun (Gate Selection).",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    specialtyIds: ["spec_polymer_composite", "spec_cad_cae"],
    softwareIds: ["soft_xtimon"],
    price: 500000,
    accessType: "PAID",
    level: "Nâng cao",
    isPublished: true,
    isFeatured: false,
    metaTitle: "Học mô phỏng CAE dòng chảy nhựa nóng bằng X-TIMON",
    metaDescription: "Khóa học phân tích điền đầy khuôn nhựa, tối ưu gate, áp suất phun và khắc phục Weldline bằng X-TIMON.",
    lastEditorUid: "usr_admin_001",
    createdAt: "2026-08-26T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "course_cnc_machining",
    title: "Lập trình gia công CNC & Dụng cụ cắt gọt",
    slug: "lap-trinh-gia-cong-cnc-dung-cu-cat",
    description: "Quy trình công nghệ gia công chi tiết máy. Lập trình mã G-code cho máy phay và tiện CNC. Lựa chọn thông số cắt tối ưu (tốc độ quay trục chính, bước tiến dao) và các loại dao cắt ngâm dầu chuyên dụng.",
    thumbnailUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    specialtyIds: ["spec_manufacturing"],
    softwareIds: [],
    price: 0,
    accessType: "FREE",
    level: "Cơ bản",
    isPublished: true,
    isFeatured: false,
    metaTitle: "Lập trình tiện phay CNC và công nghệ dụng cụ cắt gọt",
    metaDescription: "Giáo trình công nghệ chế tạo máy, lập trình G-Code CNC và tối ưu thông số cắt gọt cơ khí.",
    lastEditorUid: "usr_admin_002",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  }
];

export const lessons = [
  // Khóa học 1: course_inventor_mold_basics (5 lessons)
  {
    id: "les_mold_basics_l1",
    courseId: "course_inventor_mold_basics",
    title: "Bài 1: Tách lòng khuôn Core & Cavity sản phẩm vỏ hộp nhựa",
    slug: "bai-1-tach-long-khuon-core-cavity-san-pham-vo-hop-nhua",
    description: "Hướng dẫn nạp mô hình sản phẩm nhựa 3D, phân tích góc thoát khuôn (Draft Angle) và phân tách hai tấm khuôn lõi Core & lòng Cavity.",
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_casing_crd"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_basics_l2",
    courseId: "course_inventor_mold_basics",
    title: "Bài 2: Thiết kế Bạc cuống phun (Sprue Bushing) và Vòng định vị",
    slug: "bai-2-thiet-ke-bac-cuong-phun-sprue-bushing-vong-dinh-vi",
    description: "Quy trình lựa chọn bạc cuống phun tiêu chuẩn Futaba, định vị khuôn trên máy ép phun và thiết kế kênh dẫn nhựa (Runner).",
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_casing_crd"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_basics_l3",
    courseId: "course_inventor_mold_basics",
    title: "Bài 3: Bố trí hệ thống lói đẩy sản phẩm (Ejector Pins)",
    slug: "bai-3-bo-tri-he-thong-loi-day-san-pham-ejector-pins",
    description: "Tính toán lực cản khuôn và bố trí chốt đẩy đẩy sản phẩm nhựa ra ngoài mà không làm biến dạng bề mặt ngoại quan.",
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_mold_base_zip"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_basics_l4",
    courseId: "course_inventor_mold_basics",
    title: "Bài 4: Thiết kế hệ thống làm nguội (Cooling Channels)",
    slug: "bai-4-thiet-ke-he-thong-lam-nguoi",
    description: "Bố trí kênh dẫn nước làm mát quanh phần Core và Cavity để cân bằng nhiệt độ khuôn và giảm chu kỳ đúc nhựa.",
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_mold_handbook_pdf"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_basics_l5",
    courseId: "course_inventor_mold_basics",
    title: "Bài 5: Hoàn thiện cụm lắp ráp khuôn hoàn chỉnh",
    slug: "bai-5-hoan-thien-cum-lap-rap-khuon-hoan-chinh",
    description: "Ghép các cụm chi tiết vào vỏ khuôn tiêu chuẩn Futaba 2 tấm, kiểm tra va chạm động và xuất bản vẽ 2D hướng dẫn lắp ráp.",
    order: 5,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_mold_base_zip", "prod_mold_handbook_pdf"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },

  // Khóa học 2: course_inventor_mold_adv (4 lessons)
  {
    id: "les_mold_adv_l1",
    courseId: "course_inventor_mold_adv",
    title: "Bài 1: Phân tích hốc âm (Under-cut) và giải pháp cơ cấu trượt Slider",
    slug: "bai-1-phan-tich-hoc-am-under-cut-va-slider",
    description: "Nhận biết hốc âm trên sản phẩm nhựa cản trở hướng mở khuôn và phân tích nguyên lý hoạt động của Slider dùng chốt xiên.",
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_slider_model"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_adv_l2",
    courseId: "course_inventor_mold_adv",
    title: "Bài 2: Tính toán góc nghiêng chốt góc (Angular Pin) & hành trình trượt",
    slug: "bai-2-tinh-toan-goc-nghieng-chot-goc-hanh-trinh-truot",
    description: "Công thức cơ học xác định mối quan hệ giữa góc chốt xiên, hành trình rút lòng và kích thước khóa nêm (Wedge Block).",
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_slider_model"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_adv_l3",
    courseId: "course_inventor_mold_adv",
    title: "Bài 3: Thiết kế cơ cấu Lifter (Chốt xiên đẩy nghiêng)",
    slug: "bai-3-thiet-ke-co-cau-lifter",
    description: "Thiết kế Lifter giải phóng các mấu ngàm nhựa nhỏ nằm ẩn phía trong lòng ruột của sản phẩm, lắp đặt đế dẫn trượt xoay.",
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_slider_model"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_mold_adv_l4",
    courseId: "course_inventor_mold_adv",
    title: "Bài 4: Hệ thống hồi và bảo vệ chốt Slider",
    slug: "bai-4-he-thong-hoi-va-bao-ve-chot-slider",
    description: "Thiết kế lò xo hồi vị, cọc giới hạn hành trình và các cảm biến an toàn hành trình cho Slider lớn tránh va chạm tấm khuôn.",
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_mold_handbook_pdf"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },

  // Khóa học 3: course_solidworks_machine (5 lessons)
  {
    id: "les_sw_l1",
    courseId: "course_solidworks_machine",
    title: "Bài 1: Phác thảo 2D/3D phác họa ý tưởng máy",
    slug: "bai-1-phac-thao-2d-3d-phac-hoa-y-tuong-may",
    description: "Nguyên lý vẽ phác thảo ràng buộc hình học (parametric sketching) và mô hình hóa khung sườn máy cơ bản.",
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_sw_l2",
    courseId: "course_solidworks_machine",
    title: "Bài 2: Thiết kế các trục máy & mối liên kết then",
    slug: "bai-2-thiet-ke-cac-truc-may-va-moi-lien-ket-then",
    description: "Thiết kế trục truyền động tròn, chọn dung sai lắp ghép cho then (keyway) và vai trục định vị ổ lăn.",
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_sw_l3",
    courseId: "course_solidworks_machine",
    title: "Bài 3: Dựng hình và tính toán bánh răng thẳng",
    slug: "bai-3-dung-hinh-va-tinh-toan-banh-rang-thang",
    description: "Phương pháp tạo biên dạng răng thân khai (involute profile), tính toán mô-đun răng và khoảng cách trục lý thuyết.",
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_sw_l4",
    courseId: "course_solidworks_machine",
    title: "Bài 4: Lắp ghép cụm hộp giảm tốc (Gearbox Assembly)",
    slug: "bai-4-lap-ghep-cum-hop-giam-toc",
    description: "Mates nâng cao trong SOLIDWORKS (Gear mate, Width mate), mô phỏng quay ăn khớp răng và phát hiện va chạm lắp ráp.",
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_sw_l5",
    courseId: "course_solidworks_machine",
    title: "Bài 5: Xuất bản vẽ lắp ráp & bảng liệt kê vật tư (BOM)",
    slug: "bai-5-xuat-ban-ve-lap-rap-va-bom",
    description: "Tạo hình chiếu phân rã (exploded view), đánh số chi tiết bóng bóng (balloons) và chèn bảng kê danh mục vật tư BOM tự động.",
    order: 5,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },

  // Khóa học 4: course_polymer_mechanics (4 lessons)
  {
    id: "les_poly_l1",
    courseId: "course_polymer_mechanics",
    title: "Bài 1: Tổng quan về tính nhớt đàn hồi của nhựa nóng chảy",
    slug: "bai-1-tong-quan-ve-tinh-nhot-dan-hoi",
    description: "Tìm hiểu trạng thái vô định hình, nhiệt độ nóng chảy tinh thể của polymer và hành vi phi Newton trong dòng chảy.",
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_poly_dataset"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_poly_l2",
    courseId: "course_polymer_mechanics",
    title: "Bài 2: Tính toán phân bố vận tốc chảy trong kênh đùn tròn",
    slug: "bai-2-tinh-toan-phan-bo-van-toc-chay",
    description: "Giải phương trình Navier-Stokes đơn giản cho nhựa chảy tầng trong ống tròn sử dụng mô hình số mũ Power-law.",
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_poly_dataset"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_poly_l3",
    courseId: "course_polymer_mechanics",
    title: "Bài 3: Công nghệ gia công định hình tấm Composite",
    slug: "bai-3-cong-nghe-gia-cong-dinh-hinh-composite",
    description: "Quy trình đắp tay (Hand Lay-up), ép túi khí (Vacuum Bagging) và hóa rắn nhựa epoxy nền sợi carbon.",
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_composite_slid"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_poly_l4",
    courseId: "course_polymer_mechanics",
    title: "Bài 4: Phân tích cơ học phá hủy vật liệu composite lớp",
    slug: "bai-4-phan-tich-co-hoc-pha-huy-composite",
    description: "Phân tích hiện tượng bong tróc giữa các lớp sợi (delamination), cơ cấu truyền lực chịu ứng suất cắt giữa cốt và nền.",
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_composite_slid"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },

  // Khóa học 5: course_xtimon_flow (4 lessons)
  {
    id: "les_xtimon_l1",
    courseId: "course_xtimon_flow",
    title: "Bài 1: Khởi tạo mô hình lưới phần tử hữu hạn (Meshing) nhựa",
    slug: "bai-1-khoi-tao-mo-hinh-luoi-mesh-nhua",
    description: "Import file STEP, chia lưới bề mặt 3D Dual-Domain và sửa đổi các phần tử lưới hở (mesh defects) để chuẩn bị chạy CAE.",
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_defect_manual"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_xtimon_l2",
    courseId: "course_xtimon_flow",
    title: "Bài 2: Thiết lập vị trí cổng phun & phân tích điền đầy (Filling)",
    slug: "bai-2-thiet-lap-cong-phun-va-filling",
    description: "Lựa chọn số lượng và vị trí Gate phun nhựa, cài đặt nhiệt độ chảy loãng và chạy mô phỏng thời gian điền đầy lòng khuôn.",
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_defect_manual"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_xtimon_l3",
    courseId: "course_xtimon_flow",
    title: "Bài 3: Phân tích đường hàn nhựa (Weldlines) và bẫy khí (Air traps)",
    slug: "bai-3-phan-tich-duong-han-va-bay-khi",
    description: "Nhìn nhận các điểm tiếp giáp của 2 dòng nhựa chảy, bố trí rãnh thoát khí hoặc thay đổi cổng phun để đẩy đường hàn vào vùng khuất.",
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_defect_manual"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_xtimon_l4",
    courseId: "course_xtimon_flow",
    title: "Bài 4: Phân tích thời gian làm nguội và cong vênh sản phẩm nhựa",
    slug: "bai-4-phan-tich-lam-nguoi-va-cong-venh",
    description: "Mô phỏng áp suất duy trì (Packing phase), phân tích sự co rút không đều gây cong vênh sản phẩm nhựa.",
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_defect_manual"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },

  // Khóa học 6: course_cnc_machining (4 lessons)
  {
    id: "les_cnc_l1",
    courseId: "course_cnc_machining",
    title: "Bài 1: Nguyên lý gia công cắt gọt và động học dao tiện",
    slug: "bai-1-nguyen-ly-gia-cong-cat-got-dao-tien",
    description: "Tìm hiểu lực cắt, ma sát sinh nhiệt tại vùng cắt, cơ chế hình thành phoi dẻo và góc cắt của mảnh dao tiện carbide.",
    order: 1,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_cnc_l2",
    courseId: "course_cnc_machining",
    title: "Bài 2: Hướng dẫn viết G-Code tiện CNC cơ bản",
    slug: "bai-2-viet-gcode-tien-cnc",
    description: "Viết tay chương trình G-code sử dụng các lệnh định vị G00, cắt tuyến tính G01 và cắt cung tròn G02, G03.",
    order: 2,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: [],
    isFreePreview: true,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_cnc_l3",
    courseId: "course_cnc_machining",
    title: "Bài 3: Thiết lập phôi và tọa độ điểm gốc phôi máy (G54)",
    slug: "bai-3-thiet-lap-phoi-va-toa-do-g54",
    description: "Quy trình sét dao chạm mặt phôi để xác lập chuẩn tọa độ làm việc trên máy tiện CNC Fanuc.",
    order: 3,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: [],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  },
  {
    id: "les_cnc_l4",
    courseId: "course_cnc_machining",
    title: "Bài 4: Chu trình tiện thô và tiện tinh biên dạng phức tạp (G71)",
    slug: "bai-4-chu-trinh-tien-g71",
    description: "Lập trình chu trình tiện cắt thô dọc trục G71 kèm lượng dư tiện tinh chừa lại và gọi chương trình tiện tinh G70.",
    order: 4,
    youtubeVideoId: "dQw4w9WgXcQ",
    materialIds: ["prod_standard_elements_zip"],
    isFreePreview: false,
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:00:00Z"
  }
];

export const products = [
  {
    id: "prod_mold_base_zip",
    title: "Thư viện vỏ khuôn tiêu chuẩn Futaba 2 tấm",
    slug: "thu-vien-vo-khuon-futaba-2-tam",
    description: "Bộ file CAD lắp ráp hoàn chỉnh cụm vỏ khuôn (Mold Base) tiêu chuẩn Futaba kích thước 250x300mm. Chứa đầy đủ các tấm khuôn (A, B, Clamping, Ejector Plates) cùng chốt dẫn hướng và bạc lót dẫn trượt.",
    price: 150000,
    accessType: "PAID",
    productType: "ZIP",
    specialtyIds: ["spec_mold_design"],
    softwareIds: ["soft_inventor", "soft_mold_design"],
    fileTypes: ["ZIP", "IAM", "IPT"],
    isPublished: true,
    metaTitle: "Download thư viện vỏ khuôn Futaba 2 tấm 3D CAD",
    metaDescription: "File lắp ráp vỏ khuôn ép nhựa tiêu chuẩn Futaba 250x300. Bản vẽ kỹ thuật 3D gốc định dạng IAM và IPT.",
    createdAt: "2026-08-20T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_mold_base_001",
        productId: "prod_mold_base_zip",
        fileName: "Futaba_2530_Base.zip",
        storagePath: "private/products/prod_mold_base_zip/f_mold_base_001/Futaba_2530_Base.zip",
        fileType: "ZIP",
        fileSize: 45298120,
        contentType: "application/zip",
        version: "2.1.0",
        checksum: "8f7c9e0d1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
        createdAt: "2026-08-20T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_casing_crd",
    title: "Mẫu vỏ hộp nhựa 3D & Quy trình tách khuôn ép",
    slug: "mau-vo-hop-nhua-3d-va-tach-khuon",
    description: "Học liệu bao gồm file 3D chi tiết vỏ nhựa hộp kỹ thuật (được dùng trong Bài 1 & 2 của khóa cơ bản) cùng bản vẽ 2D thể hiện đầy đủ kích thước và yêu cầu kỹ thuật góc thoát khuôn nhựa định hình.",
    price: 0,
    accessType: "FREE",
    productType: "CAD",
    specialtyIds: ["spec_mold_design", "spec_cad_cae"],
    softwareIds: ["soft_inventor"],
    fileTypes: ["IPT", "PDF"],
    isPublished: true,
    metaTitle: "File CAD 3D vỏ hộp nhựa kỹ thuật miễn phí",
    metaDescription: "Tải file 3D vỏ nhựa hộp kỹ thuật và bản vẽ PDF phân tích góc thoát khuôn Draft Angle.",
    createdAt: "2026-08-21T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_casing_001",
        productId: "prod_casing_crd",
        fileName: "housing_body.ipt",
        storagePath: "private/products/prod_casing_crd/f_casing_001/housing_body.ipt",
        fileType: "IPT",
        fileSize: 1540200,
        contentType: "application/octet-stream",
        version: "1.0.0",
        checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        createdAt: "2026-08-21T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      },
      {
        id: "f_casing_002",
        productId: "prod_casing_crd",
        fileName: "housing_drawing.pdf",
        storagePath: "private/products/prod_casing_crd/f_casing_002/housing_drawing.pdf",
        fileType: "PDF",
        fileSize: 720450,
        contentType: "application/pdf",
        version: "1.0.0",
        checksum: "9d8e7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
        createdAt: "2026-08-21T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_slider_model",
    title: "Cụm cụ cấu Slider tách lõi hông (Core-Pulling System)",
    slug: "cum-co-cau-slider-tach-loi-hong",
    description: "Sản phẩm CAD chuyên dụng chứa file lắp ráp của hệ thống lõi trượt hông Slider dùng chốt góc xiên và bộ khóa nêm. Thích hợp làm tài liệu tham khảo thiết kế khuôn phức tạp chứa Under-cut.",
    price: 0,
    accessType: "COURSE_ONLY",
    productType: "MULTIPLE",
    specialtyIds: ["spec_mold_design"],
    softwareIds: ["soft_inventor", "soft_mold_design"],
    fileTypes: ["IAM", "IPT", "PDF"],
    isPublished: true,
    metaTitle: "Mẫu cụm chi tiết cơ cấu Slider chốt góc 3D",
    metaDescription: "Học liệu thiết kế khuôn nâng cao: Slider cơ cấu trượt rút lõi khuôn hông 3D CAD.",
    createdAt: "2026-08-22T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_slider_001",
        productId: "prod_slider_model",
        fileName: "Slider_Assembly.iam",
        storagePath: "private/products/prod_slider_model/f_slider_001/Slider_Assembly.iam",
        fileType: "IAM",
        fileSize: 5291240,
        contentType: "application/octet-stream",
        version: "1.2.0",
        checksum: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
        createdAt: "2026-08-22T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      },
      {
        id: "f_slider_002",
        productId: "prod_slider_model",
        fileName: "locking_wedge.ipt",
        storagePath: "private/products/prod_slider_model/f_slider_002/locking_wedge.ipt",
        fileType: "IPT",
        fileSize: 980500,
        contentType: "application/octet-stream",
        version: "1.2.0",
        checksum: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        createdAt: "2026-08-22T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_mold_handbook_pdf",
    title: "Sổ tay thiết kế khuôn ép phun nhựa nâng cao (PDF)",
    slug: "so-tay-thiet-ke-khuon-ep-phun-nhua",
    description: "Tài liệu kỹ thuật tổng hợp toàn bộ thông số thiết kế khuôn ép nhựa: Kích thước kênh dẫn, công thức tính toán số lượng lòng khuôn tối ưu, thiết kế hệ thống giải nhiệt và bảng tra cứu thông số co rút của các loại nhựa thông dụng PP, ABS, PC.",
    price: 80000,
    accessType: "PAID",
    productType: "PDF",
    specialtyIds: ["spec_mold_design", "spec_polymer_composite"],
    softwareIds: [],
    fileTypes: ["PDF"],
    isPublished: true,
    metaTitle: "Tải sổ tay kỹ thuật thiết kế khuôn ép nhựa PDF",
    metaDescription: "Giáo trình hướng dẫn tính toán kích thước cổng phun nhựa, runner và cooling system dạng PDF.",
    createdAt: "2026-08-23T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_handbook_001",
        productId: "prod_mold_handbook_pdf",
        fileName: "Mold_Design_Handbook_V2.pdf",
        storagePath: "private/products/prod_mold_handbook_pdf/f_handbook_001/Mold_Design_Handbook_V2.pdf",
        fileType: "PDF",
        fileSize: 12589000,
        contentType: "application/pdf",
        version: "2.0.1",
        checksum: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
        createdAt: "2026-08-23T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_standard_elements_zip",
    title: "Thư viện 3D các chi tiết máy tiêu chuẩn hệ Metric",
    slug: "thu-vien-3d-chi-tiet-may-he-metric",
    description: "Bộ sưu tập file CAD 3D của các chi tiết máy thông dụng: Bulông lục giác chìm, đai ốc, vòng đệm, ổ lăn (bạc đạn SKF), bánh răng thẳng mô-đun 1.5 - 3.0. Hỗ trợ lắp ghép nhanh trong các phần mềm CAD cơ khí.",
    price: 120000,
    accessType: "PAID",
    productType: "ZIP",
    specialtyIds: ["spec_manufacturing", "spec_cad_cae"],
    softwareIds: ["soft_inventor", "soft_solidworks"],
    fileTypes: ["ZIP", "STEP", "SLDPRT", "IPT"],
    isPublished: true,
    metaTitle: "Thư viện 3D ổ bi bulông bánh răng CAD tiêu chuẩn",
    metaDescription: "Tải cụm chi tiết máy tiêu chuẩn hệ mét định dạng STEP trung gian, SOLIDWORKS và Inventor.",
    createdAt: "2026-08-24T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_std_001",
        productId: "prod_standard_elements_zip",
        fileName: "Metric_Standard_Elements_3D.zip",
        storagePath: "private/products/prod_standard_elements_zip/f_std_001/Metric_Standard_Elements_3D.zip",
        fileType: "ZIP",
        fileSize: 32045000,
        contentType: "application/zip",
        version: "1.0.0",
        checksum: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
        createdAt: "2026-08-24T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_poly_dataset",
    title: "Bảng dữ liệu đo nhớt chảy polymer (Rheological Data)",
    slug: "du-lieu-do-nhot-chay-polymer-rheology",
    description: "Bộ số liệu đo thực nghiệm độ nhớt của nhựa PP (Polypropylene) và PE (Polyethylene) ở các nhiệt độ gia công và tốc độ trượt khác nhau. Thích hợp để nạp vào các phần mềm mô phỏng dòng chảy CAE hoặc lập phương trình dòng chảy.",
    price: 0,
    accessType: "FREE",
    productType: "ZIP",
    specialtyIds: ["spec_polymer_composite"],
    softwareIds: ["soft_xtimon"],
    fileTypes: ["ZIP", "PDF"],
    isPublished: true,
    metaTitle: "Tải dữ liệu độ nhớt thực nghiệm nhựa PP PE chảy loãng",
    metaDescription: "Bảng số liệu Rheology của nhựa polymer nhiệt dẻo phục vụ phân tích dòng chảy và cơ học chất lỏng phi Newton.",
    createdAt: "2026-08-25T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_poly_001",
        productId: "prod_poly_dataset",
        fileName: "Polymer_Rheology_Data.zip",
        storagePath: "private/products/prod_poly_dataset/f_poly_001/Polymer_Rheology_Data.zip",
        fileType: "ZIP",
        fileSize: 1845200,
        contentType: "application/zip",
        version: "1.0.0",
        checksum: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
        createdAt: "2026-08-25T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_defect_manual",
    title: "Sổ tay xử lý khuyết tật đúc ép phun nhựa nhựa CAE (X-TIMON)",
    slug: "so-tay-xu-ly-khuyet-tat-duc-ep-phun",
    description: "Hướng dẫn thực tế cách khắc phục các khuyết tật phổ biến khi đúc nhựa: Weldlines, Sink Marks (vết lõm), Warpage (cong vênh). Cung cấp giải pháp xử lý thông qua tinh chỉnh thông số máy ép phun và hiệu chỉnh thiết kế cổng phun trên phần mềm X-TIMON.",
    price: 90000,
    accessType: "PAID",
    productType: "PDF",
    specialtyIds: ["spec_mold_design", "spec_polymer_composite", "spec_cad_cae"],
    softwareIds: ["soft_xtimon"],
    fileTypes: ["PDF"],
    isPublished: true,
    metaTitle: "Cẩm nang sửa lỗi ép phun nhựa Weldline Sinkmark PDF",
    metaDescription: "Hướng dẫn tối ưu hóa khuôn nhựa và cài đặt thông số máy đúc nhựa dựa trên kết quả mô phỏng dòng chảy CAE.",
    createdAt: "2026-08-26T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_defect_001",
        productId: "prod_defect_manual",
        fileName: "CAE_Injection_Molding_Defects_Fix.pdf",
        storagePath: "private/products/prod_defect_manual/f_defect_001/CAE_Injection_Molding_Defects_Fix.pdf",
        fileType: "PDF",
        fileSize: 8420100,
        contentType: "application/pdf",
        version: "1.1.0",
        checksum: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
        createdAt: "2026-08-26T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  },
  {
    id: "prod_composite_slid",
    title: "Slide bài giảng Công nghệ chế tạo Composite Polymer",
    slug: "slide-bai-giang-cong-nghe-composite-polymer",
    description: "Bộ slide tài liệu lý thuyết giảng dạy môn chế tạo vật liệu composite cốt sợi thủy tinh, sợi carbon. Quy trình đắp khuôn thủ công (Hand Lay-up), đúc hút chân không (Vacuum Bagging) và phân tích ứng suất cơ học vật liệu lớp.",
    price: 0,
    accessType: "COURSE_ONLY",
    productType: "PDF",
    specialtyIds: ["spec_polymer_composite"],
    softwareIds: [],
    fileTypes: ["PDF"],
    isPublished: true,
    metaTitle: "Bài giảng công nghệ chế tạo vật liệu composite PDF",
    metaDescription: "Giáo trình Slide quy trình chế tạo composite nhựa cốt sợi thủy tinh, carbon và hút chân không.",
    createdAt: "2026-08-27T08:00:00Z",
    updatedAt: "2026-08-27T15:20:00Z",
    files: [
      {
        id: "f_composite_001",
        productId: "prod_composite_slid",
        fileName: "Composite_Technology_Lecture.pdf",
        storagePath: "private/products/prod_composite_slid/f_composite_001/Composite_Technology_Lecture.pdf",
        fileType: "PDF",
        fileSize: 5204000,
        contentType: "application/pdf",
        version: "1.0.0",
        checksum: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
        createdAt: "2026-08-27T08:00:00Z",
        updatedAt: "2026-08-27T15:20:00Z"
      }
    ]
  }
];

export const videos = syncedVideos;

