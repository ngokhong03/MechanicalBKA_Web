import syncedVideos from './syncedVideos.json';

// MechanicalBKA Mock Data - Phase 2 Public Content & Relationships
// Khớp 1:1 với Firestore Schema trong MECHANICALBKA_V1_ARCHITECTURE_FINAL.md

export const specialties = [
  {
    "id": "spec_polymer_composite",
    "name": "Polymer & Composite",
    "slug": "polymer-composite",
    "description": "Lý thuyết cơ học polymer, khoa học vật liệu nhựa, lưu biến dòng chảy và công nghệ chế tạo vật liệu composite tiên tiến.",
    "order": 1,
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "spec_mold_design",
    "name": "Mold Design (Thiết kế Khuôn)",
    "slug": "mold-design",
    "description": "Kỹ thuật thiết kế khuôn ép phun nhựa, khuôn dập tấm, kết cấu cơ cấu trượt Slider/Lifter và tối ưu hóa hệ thống làm mát lòng khuôn.",
    "order": 2,
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "spec_manufacturing",
    "name": "Mechanical Manufacturing",
    "slug": "mechanical-manufacturing",
    "description": "Công nghệ chế tạo máy, lập trình gia công tiện phay CNC, thiết kế dụng cụ cắt gọt kim loại và công nghệ gia công áp lực.",
    "order": 3,
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "spec_cad_cae",
    "name": "CAD / CAE",
    "slug": "cad-cae",
    "description": "Dựng hình cơ khí 3D tham số hóa và mô phỏng số học (CAE/CFD) dòng chảy nhựa, phân tích biến dạng, ứng suất cơ học vật lý.",
    "order": 4,
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  }
];

export const software = [
  {
    "id": "soft_inventor",
    "name": "Autodesk Inventor",
    "slug": "autodesk-inventor",
    "logoUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    "description": "Dựng hình cơ khí 3D tham số, lắp ráp máy công nghiệp, thiết kế kim loại tấm và mô phỏng động học cụm chi tiết.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_mold_design",
    "name": "Autodesk Inventor Mold Design",
    "slug": "autodesk-inventor-mold-design",
    "logoUrl": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=60",
    "description": "Module chuyên dụng thiết kế khuôn ép phun: tách lòng lõi Core & Cavity, chèn vỏ khuôn tiêu chuẩn Hasco/Futaba, thiết kế hệ thống đẩy và làm mát.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_solidworks",
    "name": "SOLIDWORKS",
    "slug": "solidworks",
    "logoUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=60",
    "description": "Thiết kế máy cơ khí công nghiệp, phân tích kết cấu cơ học, xuất bản vẽ 2D tiêu chuẩn ISO và mô phỏng lắp ráp cơ cấu phức tạp.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_xtimon",
    "name": "X-TIMON",
    "slug": "x-timon",
    "logoUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=100&auto=format&fit=crop&q=60",
    "description": "Phần mềm CAE chuyên sâu mô phỏng quá trình điền đầy dòng chảy nhựa nhiệt dẻo, phân tích áp suất, nhiệt độ, bẫy khí và đường hàn nhựa.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  }
];

export const courses = [
  {
    "id": "course_metal_forming",
    "title": "Công nghệ Gia công Áp lực & Thiết bị Tạo hình Kim loại",
    "slug": "cong-nghe-gia-cong-ap-luc-thiet-bi-tao-hinh",
    "description": "Chương trình đào tạo toàn diện về lý thuyết biến dạng dẻo, phương pháp xác định lực và công biến dạng, tính toán thiết kế máy dập tạo hình và công nghệ dập vuốt, dập khối chi tiết kim loại.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "price": 0,
    "accessType": "FREE",
    "level": "Trung cấp",
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Công nghệ gia công áp lực và thiết bị tạo hình kim loại",
    "metaDescription": "Giáo trình lý thuyết biến dạng kim loại, máy dập tạo hình và tính toán công nghệ gia công áp lực chuẩn Bách Khoa.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-19T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "course_cnc_machining_tools",
    "title": "Thiết kế Dụng cụ Cắt gọt & Lập trình Gia công CNC",
    "slug": "thiet-ke-dung-cu-cat-got-lap-trinh-cnc",
    "description": "Khóa học thực hành từ cơ bản đến nâng cao về cấu trúc máy công cụ, lập trình tiện phay CNC mã Fanuc, robot công nghiệp KUKA và phương pháp tính toán, thiết kế đồ án dao cắt kim loại tiêu chuẩn ISO.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "price": 280000,
    "accessType": "PAID",
    "level": "Cơ bản",
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Thiết kế dụng cụ cắt gọt và lập trình gia công CNC",
    "metaDescription": "Khóa học thiết kế dao tiện phay, vận hành máy CNC Fanuc, robot KUKA và làm đồ án dao cắt gọt chuyên nghiệp.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-15T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "course_injection_mold_technology",
    "title": "Thiết kế Khuôn ép phun Nhựa & Phân tích Khuyết tật Đúc",
    "slug": "thiet-ke-khuon-ep-phun-nhua-khac-phuc-khuyet-tat",
    "description": "Quy trình tính toán và thiết kế khuôn ép phun nhựa 3D hoàn chỉnh trên Inventor Mold Design, lựa chọn vật liệu nhựa, thiết lập thông số công nghệ máy ép và xử lý triệt để các lỗi khuyết tật sản phẩm bằng mô phỏng CAE.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_mold_design",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_mold_design",
      "soft_xtimon"
    ],
    "price": 450000,
    "accessType": "PAID",
    "level": "Nâng cao",
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Thiết kế khuôn ép phun nhựa và xử lý khuyết tật đúc ép",
    "metaDescription": "Khóa học thiết kế khuôn nhựa 3D, tối ưu hệ thống rót, làm mát và sửa lỗi cong vênh, weldline, sinkmark chuyên sâu.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-11T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "course_extrusion_technology",
    "title": "Công nghệ Đùn ép Nhựa & Thiết kế Đầu đùn Định hình",
    "slug": "cong-nghe-dun-ep-nhua-thiet-ke-dau-dun",
    "description": "Khóa học chuyên sâu về nguyên lý hoạt động của máy đùn trục vít, tính chất lưu biến của nhựa nhiệt dẻo, vận hành dây chuyền đùn liên tục và thiết kế đầu đùn (Die) định hình ống nhựa, tấm nhựa công nghiệp.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_polymer_composite",
      "spec_manufacturing"
    ],
    "softwareIds": [
      "soft_inventor"
    ],
    "price": 350000,
    "accessType": "PAID",
    "level": "Trung cấp",
    "isPublished": true,
    "isFeatured": false,
    "metaTitle": "Công nghệ đùn ép nhựa và thiết kế đầu đùn định hình",
    "metaDescription": "Giáo trình công nghệ đùn nhựa trục vít, thiết kế die đầu đùn ống nhựa profile và quản lý dây chuyền đùn.",
    "lastEditorUid": "usr_admin_002",
    "createdAt": "2026-07-28T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "course_polymer_flow_cfd",
    "title": "Cơ học Dòng chảy Polymer & Mô phỏng CFD Dòng nhựa",
    "slug": "co-hoc-dong-chay-polymer-mo-phong-cfd",
    "description": "Nghiên cứu quy luật lưu biến (Rheology) của dung dịch và polymer nóng chảy phi Newton, phân tích gradient vận tốc, ứng suất cắt và ứng dụng công cụ CFD/CAE trong tối ưu hóa dòng chảy khuôn đúc.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_polymer_composite",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_xtimon"
    ],
    "price": 0,
    "accessType": "FREE",
    "level": "Nâng cao",
    "isPublished": true,
    "isFeatured": false,
    "metaTitle": "Cơ học dòng chảy polymer và mô phỏng CFD dòng nhựa",
    "metaDescription": "Học lý thuyết chất lỏng phi Newton, đặc tính lưu biến polymer và ứng dụng CFD mô phỏng dòng chảy đúc nhựa.",
    "lastEditorUid": "usr_admin_002",
    "createdAt": "2026-07-18T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "course_composite_mechanics_design",
    "title": "Khoa học Vật liệu Composite & Tính toán Cơ học Dị hướng",
    "slug": "khoa-hoc-vat-lieu-composite-co-hoc-di-huong",
    "description": "Chương trình chuyên sâu về hóa lý polymer, vật liệu composite nền nhựa cốt sợi thủy tinh/carbon, các phương pháp gia công đắp tay/hút chân không và tính toán phân tích cơ học lớp dị hướng theo tiêu chuẩn bền.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_polymer_composite",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_solidworks"
    ],
    "price": 390000,
    "accessType": "PAID",
    "level": "Nâng cao",
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Khoa học vật liệu composite và tính toán cơ học dị hướng",
    "metaDescription": "Khóa học tính toán độ bền composite dị hướng, quy trình chế tạo composite và thiết kế chi tiết máy chất dẻo.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-07-08T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  }
];

export const lessons = [
  {
    "id": "les_forming_01",
    "courseId": "course_metal_forming",
    "title": "Bài 1: Thiết bị máy dập tạo hình và nguyên lý chọn máy",
    "slug": "bai-1-thiet-bi-may-dap-tao-hinh-va-nguyen-ly-chon-may",
    "description": "Trang bị nguyên lý, cách lựa chọn, tính toán và mô phỏng các thiết bị dập tạo hình (dập tấm, dập khối, uốn lốc...).",
    "order": 1,
    "youtubeVideoId": "hPP477VSGis",
    "materialIds": [
      "prod_forming_die_calc"
    ],
    "isFreePreview": true,
    "createdAt": "2026-08-19T07:04:35Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_forming_02",
    "courseId": "course_metal_forming",
    "title": "Bài 2: Lý thuyết biến dạng dẻo và tính toán công nghệ gia công áp lực",
    "slug": "bai-2-ly-thuyet-bien-dang-deo-va-tinh-toan-gia-cong-ap-luc",
    "description": "Kiến thức về các định luật, nguyên tắc cơ bản của gia công áp lực; Các phương pháp xác định lực và công biến dạng; Phân tích ứng suất, biến dạng; Tính toán các thông số công nghệ cơ bản cho các nguyên công chồn, rèn vuốt, ép chảy, dập khối trong khuôn hở, khuôn kín, đột lỗ, uốn, dập vuốt, lên vành và tóp miệng.",
    "order": 2,
    "youtubeVideoId": "kXwo9FqaEGY",
    "materialIds": [
      "prod_forming_die_calc"
    ],
    "isFreePreview": true,
    "createdAt": "2026-08-19T07:26:55Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cnc_01",
    "courseId": "course_cnc_machining_tools",
    "title": "Bài 1: Thực hành kỹ năng xưởng cơ khí & an toàn gia công",
    "slug": "bai-1-thuc-hanh-ky-nang-xuong-co-khi-an-toan-gia-cong",
    "description": "Cung cấp kiến thức và kỹ năng thực hành về gia công, chế tạo, lắp ráp và vận hành thiết bị cơ khí an toàn trong xưởng sản xuất.",
    "order": 1,
    "youtubeVideoId": "bu_c-3gGm08",
    "materialIds": [
      "prod_gcode_cnc_handbook"
    ],
    "isFreePreview": true,
    "createdAt": "2026-08-11T07:49:56Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cnc_02",
    "courseId": "course_cnc_machining_tools",
    "title": "Bài 2: Cơ sở tính toán và thiết kế dụng cụ cắt gọt kim loại",
    "slug": "bai-2-co-so-tinh-toan-va-thiet-ke-dung-cu-cat-got",
    "description": "Tính toán và thiết kế dụng cụ cắt, từ dao tiện, dao phay, dao chuốt đến dụng cụ gia công răng chuyên dụng.",
    "order": 2,
    "youtubeVideoId": "XJsPETKOkJc",
    "materialIds": [
      "prod_cutting_tools_cad"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-11T08:31:46Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cnc_03",
    "courseId": "course_cnc_machining_tools",
    "title": "Bài 3: Cấu trúc máy công cụ CNC và Robot công nghiệp",
    "slug": "bai-3-cau-truc-may-cong-cu-cnc-va-robot-cong-nghiep",
    "description": "Tìm hiểu hệ điều khiển CNC, cấu trúc máy, truyền động, lập trình CNC và ứng dụng robot KUKA tự động hóa trong sản xuất hiện đại.",
    "order": 3,
    "youtubeVideoId": "GULpysm14DE",
    "materialIds": [
      "prod_gcode_cnc_handbook"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-15T09:30:46Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cnc_04",
    "courseId": "course_cnc_machining_tools",
    "title": "Bài 4: Động lực học truyền động và thiết kế kết cấu máy công cụ",
    "slug": "bai-4-dong-luc-hoc-truyen-dong-thiet-ke-ket-cau-may",
    "description": "Tìm hiểu cấu trúc, truyền động, điều khiển và động lực học máy công cụ; tính toán và thiết kế các hệ thống, kết cấu máy và xuất bản vẽ kỹ thuật.",
    "order": 4,
    "youtubeVideoId": "lsCe6feRGAI",
    "materialIds": [
      "prod_gcode_cnc_handbook"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-15T09:51:23Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cnc_05",
    "courseId": "course_cnc_machining_tools",
    "title": "Bài 5: Lập trình gia công tiện phay CNC với hệ điều khiển Fanuc",
    "slug": "bai-5-lap-trinh-gia-cong-cnc-he-dieu-khien-fanuc",
    "description": "Công nghệ CNC: Lập trình mã G-code, vận hành máy phay tiện CNC, bảng mã Fanuc và ứng dụng CAD/CAM trong gia công cơ khí chính xác.",
    "order": 5,
    "youtubeVideoId": "FtPAG1zJDTs",
    "materialIds": [
      "prod_gcode_cnc_handbook"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-15T10:11:03Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cnc_06",
    "courseId": "course_cnc_machining_tools",
    "title": "Bài 6: Đồ án thiết kế dụng cụ cắt chuyên dụng 2D/3D CAD",
    "slug": "bai-6-do-an-thiet-ke-dung-cu-cat-chuyen-dung-cad",
    "description": "Học phần Thiết kế dụng cụ cắt tập trung vào thiết kế dao cắt tiêu chuẩn và phi tiêu chuẩn, kết hợp thiết kế 2D/3D trên CAD và các kỹ năng kỹ thuật.",
    "order": 6,
    "youtubeVideoId": "8GAm-l7FwtE",
    "materialIds": [
      "prod_cutting_tools_cad"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-15T10:27:50Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_mold_01",
    "courseId": "course_injection_mold_technology",
    "title": "Bài 1: Tổng quan thiết kế khuôn ép phun nhựa kỹ thuật",
    "slug": "bai-1-tong-quan-thiet-ke-khuon-ep-phun-nhua-ky-thuat",
    "description": "Học phần cung cấp kiến thức và kỹ năng tính toán, thiết kế khuôn nhựa, sử dụng phần mềm chuyên dụng và thiết kế hoàn chỉnh khuôn ép phun sẵn sàng cho gia công, sản xuất.",
    "order": 1,
    "youtubeVideoId": "YJeSSmujOGY",
    "materialIds": [
      "prod_mold_base_2026"
    ],
    "isFreePreview": true,
    "createdAt": "2026-08-11T07:18:12Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_mold_02",
    "courseId": "course_injection_mold_technology",
    "title": "Bài 2: Tính chất vật liệu nhựa ứng dụng trong đúc ép phun",
    "slug": "bai-2-tinh-chat-vat-lieu-nhua-trong-duc-ep-phun",
    "description": "Lựa chọn và phân loại các họ vật liệu nhựa nhiệt dẻo thông dụng (PP, ABS, PC, POM, PA66) và xác định độ co ngót sản phẩm trong thiết kế lòng khuôn.",
    "order": 2,
    "youtubeVideoId": "EYSsiwiHWxg",
    "materialIds": [
      "prod_mold_base_2026"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-28T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_mold_03",
    "courseId": "course_injection_mold_technology",
    "title": "Bài 3: Tính toán thông số máy ép nhựa & ứng dụng mô phỏng CAE",
    "slug": "bai-3-tinh-toan-thong-so-may-ep-nhua-va-mo-phong-cae",
    "description": "Biết lựa chọn vật liệu phù hợp, phân tích và tính toán các thông số trong quá trình đúc phun. Ứng dụng mô phỏng CAE trong tối ưu hóa các thông số của quá trình đúc phun.",
    "order": 3,
    "youtubeVideoId": "2XbNjLTSNzQ",
    "materialIds": [
      "prod_defect_troubleshooting"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-08T02:44:08Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_mold_04",
    "courseId": "course_injection_mold_technology",
    "title": "Bài 4: Thiết lập quy trình công nghệ, gá đặt khuôn và vận hành",
    "slug": "bai-4-thiet-lap-quy-trinh-cong-nghe-ga-dat-khuon-van-hanh",
    "description": "Thiết lập quy trình công nghệ, thiết bị và khuôn mẫu để gia công sản phẩm đúc phun, tối ưu hóa thời gian chu kỳ đóng mở khuôn và làm mát.",
    "order": 4,
    "youtubeVideoId": "HJEoiQbwapQ",
    "materialIds": [
      "prod_mold_base_2026"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-08T06:00:34Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_mold_05",
    "courseId": "course_injection_mold_technology",
    "title": "Bài 5: Phân tích nguyên nhân và khắc phục 24 lỗi khuyết tật đúc phun",
    "slug": "bai-5-phan-tich-nguyen-nhan-khac-phuc-khuyet-tat-duc-phun",
    "description": "Phân tích các lỗi xảy ra trong quá trình đúc phun: vết lõm Sinkmark, cong vênh Warpage, bẫy khí Air Trap, đường hàn Weldline và biết cách khắc phục triệt để.",
    "order": 5,
    "youtubeVideoId": "lDS3825vnic",
    "materialIds": [
      "prod_defect_troubleshooting"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-08T06:49:28Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_ext_01",
    "courseId": "course_extrusion_technology",
    "title": "Bài 1: Tính chất của nhựa và ứng dụng trong công nghệ đùn",
    "slug": "bai-1-tinh-chat-cua-nhua-va-ung-dung-trong-cong-nghe-dun",
    "description": "Phân tích đặc tính nhiệt động học và cơ tính của các loại polymer dùng trong công nghệ đùn liên tục ống, thanh profile và màng phim nhựa.",
    "order": 1,
    "youtubeVideoId": "WwEmH691eY4",
    "materialIds": [
      "prod_extrusion_die_cad"
    ],
    "isFreePreview": true,
    "createdAt": "2026-07-20T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_ext_02",
    "courseId": "course_extrusion_technology",
    "title": "Bài 2: Vật liệu, thiết bị máy đùn và các thông số công nghệ cốt lõi",
    "slug": "bai-2-vat-lieu-thiet-bi-may-dun-thong-so-cong-nghe",
    "description": "Cấu tạo trục vít đùn (vùng nạp, nén ép, định lượng), thiết lập dải nhiệt độ gia nhiệt xilanh và tỷ lệ L/D tối ưu cho từng loại hạt nhựa.",
    "order": 2,
    "youtubeVideoId": "N96D2N4oz78",
    "materialIds": [
      "prod_extrusion_die_cad"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-22T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_ext_03",
    "courseId": "course_extrusion_technology",
    "title": "Bài 3: Bố trí mặt bằng xưởng và quản lý dây chuyền đùn nhựa",
    "slug": "bai-3-bo-tri-mat-bang-xuong-quan-ly-day-chuyen-dun-nhua",
    "description": "Bố trí layout dây chuyền đùn công nghiệp: máy đùn chính, đầu die, bể làm mát định hình chân không, dàn kéo và máy cắt tự động.",
    "order": 3,
    "youtubeVideoId": "oHWe5R4nQog",
    "materialIds": [
      "prod_extrusion_die_cad"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-24T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_ext_04",
    "courseId": "course_extrusion_technology",
    "title": "Bài 4: Thiết lập thiết bị, kết cấu đầu đùn (Die) và xử lý sự cố đùn",
    "slug": "bai-4-thiet-lap-thiet-bi-ket-cau-dau-dun-die-va-su-co",
    "description": "Tính toán thiết kế đầu đùn dạng xoắn ốc (Spiral Die), phân bố dòng nhựa đồng đều và phương pháp xử lý lỗi bề mặt sản phẩm đùn nhựa.",
    "order": 4,
    "youtubeVideoId": "ScmSIeK0z_s",
    "materialIds": [
      "prod_extrusion_die_cad"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-26T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cfd_01",
    "courseId": "course_polymer_flow_cfd",
    "title": "Bài 1: Dòng chảy của dung dịch và polymer nóng chảy",
    "slug": "bai-1-dong-chay-cua-dung-dich-va-polymer-nong-chay",
    "description": "Hiểu bản chất dòng chảy nhớt, trạng thái chảy dẻo của polymer trong dung dịch và trạng thái nóng chảy trong các kênh dẫn cơ khí.",
    "order": 1,
    "youtubeVideoId": "JwCF8pWXwdQ",
    "materialIds": [
      "prod_xtimon_flow_samples"
    ],
    "isFreePreview": true,
    "createdAt": "2026-07-14T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cfd_02",
    "courseId": "course_polymer_flow_cfd",
    "title": "Bài 2: Đặc tính lưu biến dòng chảy polymer và các yếu tố ảnh hưởng",
    "slug": "bai-2-dac-tinh-luu-bien-dong-chay-polymer-yeu-to-anh-huong",
    "description": "Mô hình chất lỏng phi Newton (Power-law, Carreau-Yasuda), ảnh hưởng của nhiệt độ, tốc độ trượt và áp suất đến độ nhớt động lực học.",
    "order": 2,
    "youtubeVideoId": "LeRf2FHzIWA",
    "materialIds": [
      "prod_xtimon_flow_samples"
    ],
    "isFreePreview": true,
    "createdAt": "2026-07-16T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_cfd_03",
    "courseId": "course_polymer_flow_cfd",
    "title": "Bài 3: Ứng dụng CFD mô phỏng dòng chảy trong thiết kế và chế tạo sản phẩm",
    "slug": "bai-3-ung-dung-cfd-mo-phong-dong-chay-thiet-ke-san-pham",
    "description": "Thiết lập bài toán biên mô phỏng CFD dòng chảy polymer nóng chảy, phân tích trường vận tốc, nhiệt độ và gradient áp suất trong lòng khuôn.",
    "order": 3,
    "youtubeVideoId": "a4MamDsQjNk",
    "materialIds": [
      "prod_xtimon_flow_samples"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-18T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_01",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 1: Tổng hợp polymer, tính chất và ứng dụng của nhựa kỹ thuật",
    "slug": "bai-1-tong-hop-polymer-tinh-chat-ung-dung-nhua-ky-thuat",
    "description": "Nguyên lý phản ứng trùng hợp, cấu trúc mạch phân tử polymer và tương quan giữa cấu trúc vi mô với tính chất cơ nhiệt của vật liệu.",
    "order": 1,
    "youtubeVideoId": "hTWSI0pvE8o",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": true,
    "createdAt": "2026-06-30T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_02",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 2: Vật liệu composite nền polymer: Thuộc tính và ứng dụng",
    "slug": "bai-2-vat-lieu-composite-nen-polymer-thuoc-tinh-ung-dung",
    "description": "Cấu trúc vi mô của composite hạt, composite cốt sợi ngắn và sợi liên tục. Tương tác bề mặt giữa nền nhựa (Matrix) và cốt tăng cường (Fiber).",
    "order": 2,
    "youtubeVideoId": "2wADEzNsVic",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-02T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_03",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 3: Lựa chọn vật liệu nhựa và composite cho từng ứng dụng cụ thể",
    "slug": "bai-3-lua-chon-vat-lieu-nhua-va-composite-cho-ung-dung",
    "description": "Phương pháp lựa chọn vật liệu kỹ thuật dựa trên tiêu chí giới hạn độ bền, mô đun đàn hồi, khả năng chịu nhiệt và điều kiện làm việc khắc nghiệt.",
    "order": 3,
    "youtubeVideoId": "UBbA1pGpmeI",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-04T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_04",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 4: Vật liệu composite: Phân loại, tính chất cơ lý và ứng dụng",
    "slug": "bai-4-vat-lieu-composite-phan-loai-tinh-chat-co-ly",
    "description": "Phân loại chi tiết các dòng composite sợi thủy tinh (FRP), composite sợi carbon (CFRP) và composite sợi tự nhiên trong công nghiệp cơ khí và hàng không.",
    "order": 4,
    "youtubeVideoId": "iO0O-HzfPw4",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-08T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_05",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 5: Các phương pháp gia công chế tạo composite và thông số công nghệ",
    "slug": "bai-5-phuong-phap-gia-cong-che-tao-composite-thong-so",
    "description": "Công nghệ đắp tay (Hand Lay-up), ép phun chân không (RTM, VARTM), quấn sợi (Filament Winding) và ép nén nóng (Compression Molding).",
    "order": 5,
    "youtubeVideoId": "JYuArDynQaA",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-10T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_06",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 6: Thiết kế composite hướng đến khả năng chế tạo (DFM) & tái chế",
    "slug": "bai-6-thiet-ke-composite-dfm-va-kha-nang-tai-che",
    "description": "Nguyên lý DFM (Design for Manufacturing) trong thiết kế kết cấu composite nhiều lớp và các giải pháp tái chế vật liệu composite bền vững.",
    "order": 6,
    "youtubeVideoId": "AjMcYh2borw",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-07-12T11:45:25Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_07",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 7: Cơ sở cơ học vật liệu chất dẻo trong thiết kế chi tiết máy",
    "slug": "bai-7-co-so-co-hoc-vat-lieu-chat-deo-thiet-ke-chi-tiet-may",
    "description": "Thông hiểu bản chất của cơ học vật liệu chất dẻo: biến dạng nhớt dẻo, hiện tượng từ biến (Creep), chùng ứng suất (Stress Relaxation) để thiết kế chi tiết máy an toàn.",
    "order": 7,
    "youtubeVideoId": "Kc37YbiAKvQ",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-09T14:51:52Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_08",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 8: Phân tích & đánh giá đặc tính cơ học composite phục vụ thiết kế",
    "slug": "bai-8-phan-tich-danh-gia-dac-tinh-co-hoc-composite",
    "description": "Phân tích và đánh giá các thuộc tính cơ học vật liệu composite lớp (Laminate): ma trận độ cứng Q, ma trận biến đổi góc toạ độ để tính toán thiết kế kết cấu.",
    "order": 8,
    "youtubeVideoId": "mLmkcn-waoM",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-09T15:21:47Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "les_comp_09",
    "courseId": "course_composite_mechanics_design",
    "title": "Bài 9: Thiết kế & mô phỏng kết cấu composite dị hướng theo chuẩn bền và cứng",
    "slug": "bai-9-thiet-ke-mo-phong-ket-cau-composite-di-huong",
    "description": "Đánh giá, thiết kế, mô phỏng vật liệu và kết cấu composite dị hướng theo các tiêu chuẩn bền (Tsai-Wu, Tsai-Hill, Maximum Stress) và tiêu chuẩn độ cứng.",
    "order": 9,
    "youtubeVideoId": "Puw9Di7saLM",
    "materialIds": [
      "prod_composite_lecture_slides"
    ],
    "isFreePreview": false,
    "createdAt": "2026-08-09T15:56:14Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  }
];

export const products = [
  {
    "id": "prod_do_an_hop_giam_toc_2cap",
    "title": "Đồ án Chi tiết máy — Thiết kế Hộp giảm tốc 2 cấp Đồng trục (Full Bộ CAD + Excel + Thuyết minh)",
    "slug": "do-an-chi-tiet-may-hop-giam-toc-2-cap-dong-truc",
    "description": "Bộ hồ sơ thiết kế đồ án Chi tiết máy hoàn chỉnh: Mô hình 3D tham số hóa cụm hộp giảm tốc 2 cấp đồng trục trên Autodesk Inventor & SolidWorks, bản vẽ lắp A0/A1, bản vẽ chế tạo chi tiết trục & bánh răng, bảng tính Excel tự động tính toán động học, độ bền tiếp xúc và uốn, kèm file thuyết minh chuẩn Bách Khoa.",
    "shortDescription": "Trọn bộ đồ án HGT 2 cấp đồng trục — CAD 3D, Excel tính toán, bản vẽ và thuyết minh.",
    "highlights": ["Mô hình 3D tham số hóa hoàn chỉnh Inventor & SolidWorks", "Bảng tính Excel tự động tính toán theo giáo trình Nguyễn Trọng Hiệp", "Bản vẽ lắp A0/A1 và bản vẽ chế tạo chi tiết tiêu chuẩn", "File thuyết minh Word chuẩn định dạng Bách Khoa"],
    "includedFiles": ["File CAD 3D Autodesk Inventor (IAM, IPT)", "File CAD 3D SolidWorks (SLDASM, SLDPRT)", "Bản vẽ lắp cụm hộp giảm tốc (DWG)", "Bản vẽ chế tạo chi tiết trục, bánh răng (DWG)", "Bảng tính Excel tự động (XLSX)", "Thuyết minh đồ án (DOCX, PDF)"],
    "price": 450000,
    "accessType": "PAID",
    "productType": "PROJECT",
    "projectType": "Hộp giảm tốc",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "fileTypes": [
      "ZIP",
      "IAM",
      "IPT",
      "DWG",
      "PDF",
      "XLSX",
      "DOCX"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Đồ án Chi tiết máy Hộp giảm tốc 2 cấp đồng trục Full CAD Excel Thuyết minh",
    "metaDescription": "Tải trọn bộ đồ án Chi tiết máy hộp giảm tốc 2 cấp đồng trục: bản vẽ CAD 2D/3D, file tính toán Excel tự động và thuyết minh chuẩn.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-25T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_hgt_2cap_001",
        "productId": "prod_do_an_hop_giam_toc_2cap",
        "fileName": "DoAn_ChiTietMay_HopGiamToc_2Cap_DongTruc_Full.zip",
        "storagePath": "private/products/prod_do_an_hop_giam_toc_2cap/f_hgt_2cap_001/DoAn_ChiTietMay_HopGiamToc_2Cap_DongTruc_Full.zip",
        "fileType": "ZIP",
        "fileSize": 44670000,
        "contentType": "application/zip",
        "version": "2.0.0",
        "checksum": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        "createdAt": "2026-08-25T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_do_an_hop_giam_toc_khai_trien",
    "title": "Đồ án Chi tiết máy — Thiết kế Hộp giảm tốc 2 cấp Khai triển Bánh răng Trụ răng nghiêng",
    "slug": "do-an-chi-tiet-may-hop-giam-toc-2-cap-khai-trien",
    "description": "Bộ file đồ án Chi tiết máy hoàn chỉnh sơ đồ khai triển: Hệ dẫn động cơ khí băng tải, phân phối tỷ số truyền, tính toán thiết kế bộ truyền đai thang và 2 cặp bánh răng trụ răng nghiêng, tính toán then, ổ lăn và thiết kế vỏ hộp đúc.",
    "shortDescription": "Đồ án HGT 2 cấp khai triển bánh răng trụ răng nghiêng — hệ dẫn động băng tải.",
    "highlights": ["Sơ đồ khai triển hệ dẫn động băng tải hoàn chỉnh", "Tính toán bộ truyền đai thang và 2 cặp bánh răng trụ răng nghiêng", "Thiết kế trục, then, ổ lăn và vỏ hộp đúc", "File Inventor và SolidWorks song song"],
    "includedFiles": ["File CAD 3D Inventor (IAM, IPT)", "File CAD 3D SolidWorks (SLDASM)", "Bản vẽ lắp hộp giảm tốc khai triển (DWG)", "Bản vẽ chế tạo chi tiết (DWG)", "Bảng tính Excel trục và ổ lăn (XLSX)", "Thuyết minh đồ án (DOCX, PDF)"],
    "price": 450000,
    "accessType": "PAID",
    "productType": "PROJECT",
    "projectType": "Hộp giảm tốc",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "fileTypes": [
      "ZIP",
      "IAM",
      "SLDASM",
      "DWG",
      "PDF",
      "XLSX",
      "DOCX"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Đồ án Chi tiết máy Hộp giảm tốc 2 cấp khai triển bánh răng trụ răng nghiêng",
    "metaDescription": "Bộ file đồ án Chi tiết máy hộp giảm tốc khai triển: 3D CAD Inventor/SolidWorks, bảng tính Excel trục và ổ lăn.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-24T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_hgt_kt_001",
        "productId": "prod_do_an_hop_giam_toc_khai_trien",
        "fileName": "DoAn_ChiTietMay_HGT_KhaiTrien_Full_Package.zip",
        "storagePath": "private/products/prod_do_an_hop_giam_toc_khai_trien/f_hgt_kt_001/DoAn_ChiTietMay_HGT_KhaiTrien_Full_Package.zip",
        "fileType": "ZIP",
        "fileSize": 52140000,
        "contentType": "application/zip",
        "version": "2.1.0",
        "checksum": "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
        "createdAt": "2026-08-24T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_bo_ban_ve_chi_tiet_may",
    "title": "Bộ Bản vẽ Kỹ thuật Chi tiết máy & Hộp giảm tốc Tiêu chuẩn (AutoCAD DWG & PDF)",
    "slug": "bo-ban-ve-ky-thuat-chi-tiet-may-hop-giam-toc-dwg-pdf",
    "description": "Tập hợp hơn 40 bản vẽ kỹ thuật 2D tiêu chuẩn TCVN / ISO bao gồm bản vẽ lắp cụm hộp giảm tốc 1 cấp, 2 cấp đồng trục, khai triển, trục vít bánh vít và các bản vẽ chế tạo chi tiết: trục I, trục II, trục III, bánh răng côn, bánh răng trụ, nắp ổ, vỏ hộp và khớp nối trục.",
    "shortDescription": "40+ bản vẽ kỹ thuật 2D tiêu chuẩn — bản vẽ lắp HGT, bản vẽ chế tạo chi tiết.",
    "highlights": ["Hơn 40 bản vẽ kỹ thuật tiêu chuẩn TCVN / ISO", "Bản vẽ lắp hộp giảm tốc 1 cấp, 2 cấp, trục vít", "Bản vẽ chế tạo chi tiết trục, bánh răng, vỏ hộp", "Định dạng AutoCAD DWG và PDF chất lượng cao"],
    "includedFiles": ["Bản vẽ lắp cụm hộp giảm tốc (DWG)", "Bản vẽ chế tạo trục I, II, III (DWG)", "Bản vẽ chế tạo bánh răng côn, trụ (DWG)", "Bản vẽ nắp ổ, vỏ hộp, khớp nối (DWG)", "Bản in PDF chất lượng cao (PDF)"],
    "price": 180000,
    "accessType": "PAID",
    "productType": "DRAWING",
    "projectType": "Bản vẽ kỹ thuật",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "fileTypes": [
      "DWG",
      "PDF",
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Bộ bản vẽ kỹ thuật Chi tiết máy và hộp giảm tốc DWG PDF tiêu chuẩn",
    "metaDescription": "Tải 40+ bản vẽ kỹ thuật chi tiết máy: bản vẽ lắp hộp giảm tốc, bản vẽ chế tạo bánh răng, trục tiêu chuẩn.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-23T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_bv_ctm_001",
        "productId": "prod_bo_ban_ve_chi_tiet_may",
        "fileName": "Bo_Ban_Ve_Ky_Thuat_Chi_Tiet_May_AutoCAD_DWG_PDF.zip",
        "storagePath": "private/products/prod_bo_ban_ve_chi_tiet_may/f_bv_ctm_001/Bo_Ban_Ve_Ky_Thuat_Chi_Tiet_May_AutoCAD_DWG_PDF.zip",
        "fileType": "ZIP",
        "fileSize": 28400000,
        "contentType": "application/zip",
        "version": "1.5.0",
        "checksum": "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
        "createdAt": "2026-08-23T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_tinh_toan_truc_o_lan",
    "title": "Bộ File Excel Tự động Tính toán Thiết kế Trục, Ổ lăn, Then & Bộ truyền Bánh răng",
    "slug": "bo-file-excel-tu-dong-tinh-toan-truc-o-lan-then-banh-rang",
    "description": "Bảng tính kỹ thuật lập trình công thức chuẩn giáo trình Chi tiết máy Nguyễn Trọng Hiệp & Trịnh Chất: Tự động vẽ biểu đồ mô men uốn xoay (Mx, My, Mz), tính đường kính trục theo độ bền mỏi, kiểm nghiệm then bằng / then bán nguyệt, tra cứu và kiểm nghiệm tuổi thọ ổ lăn (L10h) và xuất báo cáo kết quả.",
    "shortDescription": "Excel tự động tính toán trục, ổ lăn, then và bánh răng theo giáo trình CTM.",
    "highlights": ["Công thức chuẩn giáo trình Nguyễn Trọng Hiệp & Trịnh Chất", "Tự động vẽ biểu đồ mô men uốn xoắn (Mx, My, Mz)", "Kiểm nghiệm then bằng, then bán nguyệt theo tiêu chuẩn", "Tra cứu và kiểm nghiệm tuổi thọ ổ lăn L10h"],
    "includedFiles": ["File Excel tính toán trục (XLSX)", "File Excel tính toán ổ lăn (XLSX)", "File Excel tính toán bánh răng (XLSX)", "Hướng dẫn sử dụng (PDF)"],
    "price": 120000,
    "accessType": "PAID",
    "productType": "CALCULATION",
    "projectType": "Tính toán kỹ thuật",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [],
    "fileTypes": [
      "XLSX",
      "PDF",
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Bộ file Excel tính toán thiết kế trục ổ lăn then và bánh răng đồ án chi tiết máy",
    "metaDescription": "File Excel tính toán đồ án chi tiết máy tự động: tính mô men uốn xoắn, chọn ổ lăn, kiểm nghiệm then và bánh răng.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-22T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_calc_truc_001",
        "productId": "prod_tinh_toan_truc_o_lan",
        "fileName": "Excel_Auto_Calculation_Shafts_Bearings_Gears.zip",
        "storagePath": "private/products/prod_tinh_toan_truc_o_lan/f_calc_truc_001/Excel_Auto_Calculation_Shafts_Bearings_Gears.zip",
        "fileType": "ZIP",
        "fileSize": 8650000,
        "contentType": "application/zip",
        "version": "3.0.0",
        "checksum": "d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
        "createdAt": "2026-08-22T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_cad_inventor_do_an",
    "title": "Bộ Thư viện 3D CAD Inventor Cụm Hộp giảm tốc & Chi tiết máy Tham số hóa",
    "slug": "bo-thu-vien-3d-cad-inventor-hop-giam-toc-chi-tiet-may",
    "description": "Bộ mô hình 3D Autodesk Inventor (.IAM, .IPT) hoàn chỉnh có thể chỉnh sửa tham số (Parameters) dễ dàng: Hộp giảm tốc nón - trụ, trục vít bánh vít, bộ truyền xích con lăn, khớp nối bù, gối đỡ ổ lăn và bu lông vòng tiêu chuẩn.",
    "shortDescription": "Thư viện 3D Inventor tham số hóa — HGT, bộ truyền, ổ lăn và phụ kiện máy.",
    "highlights": ["Mô hình 3D tham số hóa có thể chỉnh sửa Parameters", "HGT nón-trụ, trục vít bánh vít, bộ truyền xích", "Khớp nối bù, gối đỡ ổ lăn và bu lông vòng", "Định dạng gốc Inventor IAM/IPT và STEP"],
    "includedFiles": ["File lắp ráp Inventor (IAM)", "File chi tiết Inventor (IPT)", "File trung gian STEP"],
    "price": 320000,
    "accessType": "PAID",
    "productType": "CAD_PROJECT",
    "projectType": "CAD 3D",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor"
    ],
    "fileTypes": [
      "IAM",
      "IPT",
      "STEP",
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Thư viện 3D CAD Autodesk Inventor Hộp giảm tốc chi tiết máy tham số hóa",
    "metaDescription": "Tải mô hình 3D Inventor IAM IPT cụm hộp giảm tốc nón trụ, bánh răng, trục và vỏ hộp tham số hóa.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-21T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_inv_ctm_001",
        "productId": "prod_cad_inventor_do_an",
        "fileName": "Inventor_3D_Gearbox_Machine_Elements_Library.zip",
        "storagePath": "private/products/prod_cad_inventor_do_an/f_inv_ctm_001/Inventor_3D_Gearbox_Machine_Elements_Library.zip",
        "fileType": "ZIP",
        "fileSize": 68400000,
        "contentType": "application/zip",
        "version": "2026.1",
        "checksum": "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
        "createdAt": "2026-08-21T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_cad_solidworks_do_an",
    "title": "Bộ Thư viện 3D SOLIDWORKS Cơ cấu Máy & Cụm Chi tiết máy Chuẩn ISO",
    "slug": "bo-thu-vien-3d-solidworks-co-cau-may-chi-tiet-may-iso",
    "description": "Bộ mô hình 3D SOLIDWORKS (.SLDASM, .SLDPRT) đầy đủ cấu hình linh hoạt (Configurations): Cụm hộp giảm tốc 2 cấp, cơ cấu 4 khâu bản lề, cơ cấu tay quay con trượt, bộ truyền bánh răng nghiêng và ổ đỡ lăn tiêu chuẩn ISO.",
    "price": 320000,
    "accessType": "PAID",
    "productType": "CAD_PROJECT",
    "projectType": "CAD 3D",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_solidworks"
    ],
    "fileTypes": [
      "SLDASM",
      "SLDPRT",
      "STEP",
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Thư viện 3D CAD SolidWorks cơ cấu máy và cụm chi tiết máy ISO",
    "metaDescription": "Tải mô hình 3D SolidWorks SLDASM SLDPRT cơ cấu máy, hộp giảm tốc và cụm chi tiết máy tiêu chuẩn.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-21T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_sw_ctm_001",
        "productId": "prod_cad_solidworks_do_an",
        "fileName": "SolidWorks_3D_Mechanisms_Gearbox_Library.zip",
        "storagePath": "private/products/prod_cad_solidworks_do_an/f_sw_ctm_001/SolidWorks_3D_Mechanisms_Gearbox_Library.zip",
        "fileType": "ZIP",
        "fileSize": 62100000,
        "contentType": "application/zip",
        "version": "2026.1",
        "checksum": "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
        "createdAt": "2026-08-21T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_tool_tinh_chi_tiet_may",
    "title": "Tool Script Hỗ trợ Tính toán Thiết kế Chi tiết máy & Tối ưu Bộ truyền Cơ khí",
    "slug": "tool-script-tinh-toan-thiet-ke-chi-tiet-may-toi-uu-bo-truyen",
    "description": "Bộ công cụ lập trình Python & Excel VBA chuyên dụng: Tự động tối ưu hóa góc nghiêng răng beta, tính toán khoảng cách trục tiêu chuẩn, kiểm tra điều kiện không chạm đáy răng và xuất tự động file thông số kích thước hình học sang bảng tính.",
    "price": 150000,
    "accessType": "PAID",
    "productType": "TOOL",
    "projectType": "Công cụ lập trình",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [],
    "fileTypes": [
      "ZIP",
      "XLSX",
      "PDF"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Tool script tính toán thiết kế chi tiết máy và tối ưu hóa bộ truyền bánh răng",
    "metaDescription": "Tải tool Python và Excel VBA tự động tính toán kích thước hình học bánh răng, tối ưu góc nghiêng và khoảng cách trục.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_tool_calc_001",
        "productId": "prod_tool_tinh_chi_tiet_may",
        "fileName": "Machine_Elements_Design_Optimization_Tools.zip",
        "storagePath": "private/products/prod_tool_tinh_chi_tiet_may/f_tool_calc_001/Machine_Elements_Design_Optimization_Tools.zip",
        "fileType": "ZIP",
        "fileSize": 14200000,
        "contentType": "application/zip",
        "version": "1.2.0",
        "checksum": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        "createdAt": "2026-08-20T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_template_thuyet_minh",
    "title": "Template Thuyết minh Đồ án Chi tiết máy Chuẩn Bách Khoa (DOCX & PDF)",
    "slug": "template-thuyet-minh-do-an-chi-tiet-may-chuan-bach-khoa",
    "description": "Mẫu tài liệu Word (.DOCX) định dạng chuẩn học thuật: Đầy đủ bìa, mục lục tự động, danh mục bảng biểu và hình vẽ, cài sẵn font số công thức Mathtype / Equation, chia sẵn 7 chương tính toán từ chọn động cơ đến thiết kế vỏ hộp và bôi trơn.",
    "price": 0,
    "accessType": "FREE",
    "productType": "TEMPLATE",
    "projectType": "Template thuyết minh",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [],
    "fileTypes": [
      "DOCX",
      "PDF",
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Template mẫu thuyết minh đồ án Chi tiết máy chuẩn Đại học Bách Khoa Word DOCX",
    "metaDescription": "Tải miễn phí template Word thuyết minh đồ án chi tiết máy chuẩn định dạng, mục lục và bảng biểu tự động.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_template_tm_001",
        "productId": "prod_template_thuyet_minh",
        "fileName": "Template_ThuyetMinh_DoAn_ChiTietMay_ChuanBK.zip",
        "storagePath": "public/products/prod_template_thuyet_minh/f_template_tm_001/Template_ThuyetMinh_DoAn_ChiTietMay_ChuanBK.zip",
        "fileType": "ZIP",
        "fileSize": 5400000,
        "contentType": "application/zip",
        "version": "2026.1",
        "checksum": "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        "createdAt": "2026-08-20T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_mold_base_2026",
    "title": "Bộ Thư viện Vỏ khuôn Tiêu chuẩn 3D CAD (Hasco / Futaba / DME)",
    "slug": "thu-vien-vo-khuon-tieu-chuan-3d-cad",
    "description": "Thư viện mô hình 3D vỏ khuôn mẫu tiêu chuẩn 2 tấm và 3 tấm đầy đủ chốt dẫn hướng, bạc định vị, lò xo và chốt đẩy cho Autodesk Inventor & SOLIDWORKS.",
    "price": 0,
    "accessType": "FREE",
    "productType": "CAD_PROJECT",
    "projectType": "Khuôn mẫu",
    "specialtyIds": [
      "spec_mold_design",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_mold_design",
      "soft_solidworks"
    ],
    "fileTypes": [
      "ZIP",
      "CAD"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Thư viện vỏ khuôn ép nhựa Hasco Futaba DME 3D CAD miễn phí",
    "metaDescription": "Tải trọn bộ 3D Mold Base tiêu chuẩn cho Autodesk Inventor và SolidWorks định dạng STEP, IPT, SLDPRT.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_mold_base_001",
        "productId": "prod_mold_base_2026",
        "fileName": "MoldBase_Standard_Library_2026.zip",
        "storagePath": "public/products/prod_mold_base_2026/f_mold_base_001/MoldBase_Standard_Library_2026.zip",
        "fileType": "ZIP",
        "fileSize": 48500000,
        "contentType": "application/zip",
        "version": "2.1.0",
        "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "createdAt": "2026-08-20T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_gcode_cnc_handbook",
    "title": "Sổ tay Lập trình G-Code CNC & Bảng Tính Chế độ Cắt Fanuc",
    "slug": "so-tay-lap-trinh-gcode-cnc-bang-tinh-che-do-cat",
    "description": "Tài liệu kỹ thuật tổng hợp toàn bộ mã lệnh G-Code / M-Code cho máy phay 3 trục và tiện CNC Fanuc kèm công thức tính toán tốc độ quay trục chính (V), bước tiến dao (F) và chiều sâu cắt cho các loại vật liệu kim loại.",
    "price": 0,
    "accessType": "FREE",
    "productType": "DOCUMENT",
    "projectType": "Sổ tay kỹ thuật",
    "specialtyIds": [
      "spec_manufacturing"
    ],
    "softwareIds": [],
    "fileTypes": [
      "PDF"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Sổ tay tra cứu mã lệnh G-Code CNC và bảng tính chế độ cắt Fanuc PDF",
    "metaDescription": "Tải cẩm nang lập trình tiện phay CNC Fanuc, tra cứu mã chu trình khoan taro phay ren chi tiết.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-15T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_cnc_001",
        "productId": "prod_gcode_cnc_handbook",
        "fileName": "Fanuc_CNC_GCode_Machining_Handbook.pdf",
        "storagePath": "public/products/prod_gcode_cnc_handbook/f_cnc_001/Fanuc_CNC_GCode_Machining_Handbook.pdf",
        "fileType": "PDF",
        "fileSize": 12400000,
        "contentType": "application/pdf",
        "version": "1.3.0",
        "checksum": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
        "createdAt": "2026-08-15T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_defect_troubleshooting",
    "title": "Cẩm nang Tra cứu & Sửa lỗi 24 Khuyết tật Đúc ép Nhựa CAE",
    "slug": "cam-nang-tra-cuu-sua-loi-24-khuyet-tat-duc-ep-nhua",
    "description": "Cẩm nang chuyên gia hướng dẫn tối ưu hóa khuôn nhựa và điều chỉnh thông số áp suất, nhiệt độ máy đúc ép phun dựa trên kết quả phân tích mô phỏng dòng chảy CAE để loại bỏ triệt để 24 khuyết tật đúc thường gặp.",
    "price": 150000,
    "accessType": "PAID",
    "productType": "DOCUMENT",
    "projectType": "Cẩm nang kỹ thuật",
    "specialtyIds": [
      "spec_mold_design",
      "spec_polymer_composite",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_xtimon"
    ],
    "fileTypes": [
      "PDF"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Cẩm nang tra cứu và khắc phục lỗi ép phun nhựa Weldline Sinkmark PDF",
    "metaDescription": "Hướng dẫn xử lý lỗi khuyết tật đúc ép phun nhựa: cong vênh, lõm bề mặt, thiếu liệu và bẫy khí.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-11T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_defect_001",
        "productId": "prod_defect_troubleshooting",
        "fileName": "Injection_Molding_Defects_Troubleshooting_Guide.pdf",
        "storagePath": "private/products/prod_defect_troubleshooting/f_defect_001/Injection_Molding_Defects_Troubleshooting_Guide.pdf",
        "fileType": "PDF",
        "fileSize": 18600000,
        "contentType": "application/pdf",
        "version": "2.0.0",
        "checksum": "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        "createdAt": "2026-08-11T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_composite_lecture_slides",
    "title": "Slide Giáo trình & Bài giảng Công nghệ Chế tạo Composite Polymer",
    "slug": "slide-giao-trinh-bai-giang-cong-nghe-composite-polymer",
    "description": "Bộ slide tài liệu lý thuyết giảng dạy môn chế tạo vật liệu composite cốt sợi thủy tinh, sợi carbon. Quy trình đắp khuôn thủ công (Hand Lay-up), đúc hút chân không (Vacuum Bagging) và phân tích ứng suất cơ học lớp dị hướng.",
    "price": 0,
    "accessType": "COURSE_ONLY",
    "productType": "DOCUMENT",
    "projectType": "Tài liệu giảng dạy",
    "specialtyIds": [
      "spec_polymer_composite"
    ],
    "softwareIds": [],
    "fileTypes": [
      "PDF"
    ],
    "isPublished": true,
    "isFeatured": false,
    "metaTitle": "Bài giảng công nghệ chế tạo vật liệu composite PDF",
    "metaDescription": "Giáo trình Slide quy trình chế tạo composite nhựa cốt sợi thủy tinh, carbon và hút chân không.",
    "lastEditorUid": "usr_admin_002",
    "createdAt": "2026-07-08T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_comp_slide_001",
        "productId": "prod_composite_lecture_slides",
        "fileName": "Composite_Manufacturing_Lectures_Complete.pdf",
        "storagePath": "private/products/prod_composite_lecture_slides/f_comp_slide_001/Composite_Manufacturing_Lectures_Complete.pdf",
        "fileType": "PDF",
        "fileSize": 24500000,
        "contentType": "application/pdf",
        "version": "1.2.0",
        "checksum": "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
        "createdAt": "2026-07-08T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_forming_die_calc",
    "title": "Bảng tính Excel & Bản vẽ CAD Khuôn Dập vuốt, Dập khối Kim loại",
    "slug": "bang-tinh-excel-ban-ve-cad-khuon-dap-vuot-dap-khoi",
    "description": "Bộ công cụ kỹ thuật bao gồm file Excel tự động tính toán lực dập, công biến dạng, kích thước phôi tròn phẳng cho dập vuốt sâu và bản vẽ lắp ráp cụm khuôn dập kim loại tấm 3D trên Inventor.",
    "price": 220000,
    "accessType": "PAID",
    "productType": "CALCULATION",
    "projectType": "Khuôn dập",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor"
    ],
    "fileTypes": [
      "ZIP",
      "CAD"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Bảng tính lực dập vuốt dập khối và bộ bản vẽ CAD khuôn dập kim loại",
    "metaDescription": "Tải file tính toán công nghệ gia công áp lực Excel và bộ khuôn dập tấm kim loại 3D CAD.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-19T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_forming_001",
        "productId": "prod_forming_die_calc",
        "fileName": "Metal_Forming_Die_Design_Calc_CAD.zip",
        "storagePath": "private/products/prod_forming_die_calc/f_forming_001/Metal_Forming_Die_Design_Calc_CAD.zip",
        "fileType": "ZIP",
        "fileSize": 32800000,
        "contentType": "application/zip",
        "version": "1.1.0",
        "checksum": "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
        "createdAt": "2026-08-19T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_extrusion_die_cad",
    "title": "Bộ Bản vẽ 3D CAD Đầu đùn Định hình Ống nhựa PVC & Profile",
    "slug": "bo-ban-ve-3d-cad-dau-dun-dinh-hinh-ong-nhua-pvc",
    "description": "Bộ mô hình 3D tham số hóa đầu đùn ống nhựa PVC/HDPE đường kính phi 60 - phi 110 kèm bộ nẹp định hình làm mát chân không (Vacuum Calibrator) cho Autodesk Inventor và SOLIDWORKS.",
    "price": 350000,
    "accessType": "PAID",
    "productType": "CAD_PROJECT",
    "projectType": "Đầu đùn định hình",
    "specialtyIds": [
      "spec_polymer_composite",
      "spec_manufacturing"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "fileTypes": [
      "CAD",
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": false,
    "metaTitle": "Bản vẽ 3D CAD đầu đùn định hình ống nhựa PVC HDPE",
    "metaDescription": "Tải file 3D CAD đầu đùn nhựa trục vít, áo nhiệt và nẹp định hình làm mát chân không.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-07-28T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_ext_cad_001",
        "productId": "prod_extrusion_die_cad",
        "fileName": "PVC_Pipe_Extrusion_Die_CAD_Models.zip",
        "storagePath": "private/products/prod_extrusion_die_cad/f_ext_cad_001/PVC_Pipe_Extrusion_Die_CAD_Models.zip",
        "fileType": "ZIP",
        "fileSize": 41200000,
        "contentType": "application/zip",
        "version": "1.0.0",
        "checksum": "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        "createdAt": "2026-07-28T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_xtimon_flow_samples",
    "title": "Bộ Dữ liệu Mẫu & File Thực hành Mô phỏng Dòng chảy X-TIMON",
    "slug": "bo-du-lieu-mau-file-thuc-hanh-mo-phong-dong-chay-xtimon",
    "description": "Tập tin dự án mô phỏng thực hành phân tích điền đầy khuôn nắp hộp nhựa kỹ thuật, tối ưu vị trí miệng phun (Gate) và áp suất kẹp khuôn trên phần mềm CAE X-TIMON.",
    "price": 0,
    "accessType": "COURSE_ONLY",
    "productType": "DOCUMENT",
    "projectType": "Dữ liệu mô phỏng",
    "specialtyIds": [
      "spec_polymer_composite",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_xtimon"
    ],
    "fileTypes": [
      "ZIP"
    ],
    "isPublished": true,
    "isFeatured": false,
    "metaTitle": "File dữ liệu mẫu mô phỏng dòng chảy CAE X-TIMON",
    "metaDescription": "Tài liệu đính kèm khóa học X-TIMON: file lưới 3D mesh và thông số nhựa nhiệt dẻo.",
    "lastEditorUid": "usr_admin_002",
    "createdAt": "2026-07-18T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_xtimon_001",
        "productId": "prod_xtimon_flow_samples",
        "fileName": "XTIMON_Injection_Simulation_Project_Files.zip",
        "storagePath": "private/products/prod_xtimon_flow_samples/f_xtimon_001/XTIMON_Injection_Simulation_Project_Files.zip",
        "fileType": "ZIP",
        "fileSize": 56400000,
        "contentType": "application/zip",
        "version": "1.0.0",
        "checksum": "3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
        "createdAt": "2026-07-18T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_cutting_tools_cad",
    "title": "Bộ Thư viện Bản vẽ 3D Dao tiện, Dao phay ngón Hợp kim Chuẩn ISO",
    "slug": "bo-thu-vien-ban-ve-3d-dao-tien-dao-phay-ngon-hop-kim-iso",
    "description": "Bộ mô hình 3D CAD chi tiết dao tiện ngoài gắn mảnh hợp kim, dao phay ngón 4 me cắt và dao chuốt lỗ tiêu chuẩn công nghiệp phục vụ thiết kế đồ gá, mô phỏng gia công CAM.",
    "price": 0,
    "accessType": "FREE",
    "productType": "CAD_PROJECT",
    "projectType": "Dụng cụ cắt",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor",
      "soft_solidworks"
    ],
    "fileTypes": [
      "CAD"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Thư viện 3D CAD dao tiện dao phay ngón hợp kim tiêu chuẩn ISO",
    "metaDescription": "Tải trọn bộ 3D Cutting Tools CAD cho Inventor và SolidWorks miễn phí.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-15T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z",
    "files": [
      {
        "id": "f_tool_001",
        "productId": "prod_cutting_tools_cad",
        "fileName": "ISO_Cutting_Tools_3D_Library.zip",
        "storagePath": "public/products/prod_cutting_tools_cad/f_tool_001/ISO_Cutting_Tools_3D_Library.zip",
        "fileType": "ZIP",
        "fileSize": 29300000,
        "contentType": "application/zip",
        "version": "1.0.0",
        "checksum": "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
        "createdAt": "2026-08-15T08:00:00Z",
        "updatedAt": "2026-08-27T18:00:00Z"
      }
    ]
  },
  {
    "id": "prod_shaft_design_automation_tool",
    "title": "Engineering Paper XYZ — Tự Động Hóa Thiết Kế Trục Theo TCVN",
    "slug": "shaft-design-automation-tool",
    "description": "Công cụ tính toán và tự động hóa thiết kế trục cơ khí hoàn chỉnh trên định dạng Engineering Paper XYZ (.epxyz) theo tiêu chuẩn TCVN 1065:2004 và giáo trình Chi Tiết Máy (Trịnh Chất - Lê Văn Uyển). Hiển thị đầy đủ công thức toán học trực quan, calculation trace minh bạch, các bước kiểm nghiệm tĩnh và mỏi.",
    "shortDescription": "File tính toán Engineering Paper XYZ (.epxyz) tự động hóa thiết kế trục, kiểm nghiệm bền mỏi chuẩn TCVN.",
    "price": 350000,
    "accessType": "PAID",
    "productType": "EPXYZ_FILE",
    "projectType": "Thiết kế trục",
    "version": "1.0.0",
    "changelog": "Phiên bản 1.0.0 phát hành chính thức: Tích hợp đầy đủ module tính toán trục, kiểm nghiệm tĩnh và mỏi trên định dạng Engineering Paper XYZ.",
    "specialtyIds": [
      "spec_machine_design",
      "spec_cad_cae"
    ],
    "softwareIds": [],
    "fileTypes": [
      "EPXYZ"
    ],
    "isPublished": true,
    "isFeatured": true,
    "media": {
      "thumbnailUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      "gallery": [
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
      ],
      "youtubeVideoId": "dQw4w9WgXcQ"
    },
    "content": {
      "highlights": [
        "Tự động hóa tính toán thiết kế trục",
        "Hiển thị đầy đủ công thức và các bước tính",
        "Calculation trace minh bạch",
        "Theo tiêu chuẩn và giáo trình kỹ thuật"
      ],
      "includedFiles": [
        "MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz",
        "Tài liệu hướng dẫn sử dụng"
      ]
    },
    "technical": {
      "version": "1.0.0",
      "systemRequirements": "Engineering Paper XYZ phiên bản tương thích",
      "standards": [
        "TCVN 1065:2004",
        "Trịnh Chất & Lê Văn Uyển — Tập 1, Chương 10"
      ],
      "compatibility": [
        "Engineering Paper XYZ"
      ]
    },
    "metaTitle": "Engineering Paper XYZ — Tự Động Hóa Thiết Kế Trục TCVN",
    "metaDescription": "Tải file Engineering Paper XYZ (.epxyz) tự động hóa tính toán thiết kế trục cơ khí theo tiêu chuẩn TCVN và giáo trình Chi Tiết Máy.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-30T18:00:00Z",
    "updatedAt": "2026-08-30T18:00:00Z",
    "files": [
      {
        "id": "art_shaft_v1_0_0",
        "productId": "prod_shaft_design_automation_tool",
        "fileName": "MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz",
        "storagePath": "private/products/prod_shaft_design_automation_tool/art_shaft_v1_0_0/MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz",
        "fileType": "EPXYZ",
        "fileSize": 1048576,
        "contentType": "application/json",
        "version": "1.0.0",
        "checksum": "8f4b2c1e7a9d3e5f6b0a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
        "createdAt": "2026-08-30T18:00:00Z",
        "updatedAt": "2026-08-30T18:00:00Z"
      }
    ]
  }
];

export const videos = syncedVideos;

