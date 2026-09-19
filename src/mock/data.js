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
    "id": "soft_helius",
    "name": "Autodesk Helius PFA",
    "slug": "autodesk-helius-pfa",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Phân tích phá hủy vi mô vật liệu Composite (Progressive Failure Analysis).",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_powershape",
    "name": "Autodesk PowerShape",
    "slug": "autodesk-powershape",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Xử lý, sửa chữa bề mặt CAD khuôn phức tạp chuẩn bị cho gia công CAM.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_powermill",
    "name": "Autodesk PowerMill",
    "slug": "autodesk-powermill",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Lập trình gia công khuôn CNC 3 trục, 5 trục tốc độ cao chuyên nghiệp.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_fusion",
    "name": "Autodesk Fusion",
    "slug": "autodesk-fusion",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Thiết kế tạo sinh (Generative Design), mô phỏng Injection Molding trên Cloud.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_netfabb",
    "name": "Autodesk Netfabb",
    "slug": "autodesk-netfabb",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Chuẩn bị dữ liệu và thiết kế cấu trúc mạng tinh thể (Lattice) cho In 3D.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_vault",
    "name": "Autodesk Vault",
    "slug": "autodesk-vault",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Quản lý dữ liệu sản phẩm (PDM) và kiểm soát phiên bản thiết kế cơ khí.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },

  {
    "id": "soft_autocad",
    "name": "AutoCAD",
    "slug": "autocad",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Lên bản vẽ 2D chi tiết nhựa và layout khuôn.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_nastran",
    "name": "Autodesk Nastran",
    "slug": "autodesk-nastran",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Phân tích cấu trúc và phần tử hữu hạn (FEA) cho chi tiết nhựa, composite.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },
  {
    "id": "soft_moldflow",
    "name": "Autodesk Moldflow",
    "slug": "autodesk-moldflow",
    "logoUrl": "https://images.unsplash.com/photo-1620023616238-d67b5e1329c2?w=100&auto=format&fit=crop&q=60",
    "description": "Mô phỏng dòng chảy nhựa, biến dạng cong vênh và làm mát khuôn nâng cao.",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },

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
    "id": "course_autodesk_plastic_composite",
    "title": "Masterclass: Nhựa & Composite cùng Hệ sinh thái Autodesk",
    "slug": "masterclass-nhua-composite-autodesk",
    "description": "Khóa học Masterclass toàn diện hướng dẫn chuyên sâu từ lý thuyết vật liệu, dựng hình thiết kế, phân tích kỹ thuật đến chế tạo khuôn mẫu. Áp dụng hoàn toàn hệ sinh thái phần mềm Autodesk: AutoCAD, Inventor, Mold Design, Nastran In-CAD, và Moldflow.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&auto=format&fit=crop&q=80",
    "specialtyIds": [
      "spec_polymer_composite",
      "spec_mold_design",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_autocad",
      "soft_inventor",
      "soft_mold_design",
      "soft_nastran",
      "soft_moldflow",
      "soft_helius",
      "soft_powershape",
      "soft_powermill",
      "soft_fusion",
      "soft_netfabb",
      "soft_vault"
    ],
    "price": 0,
    "accessType": "FREE",
    "level": "Nâng cao",
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Khóa học Masterclass Nhựa & Composite bằng Autodesk",
    "metaDescription": "Hướng dẫn thiết kế nhựa, khuôn mẫu, Nastran FEA và Moldflow CFD từ chuyên gia.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-27T18:00:00Z"
  },

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
    "id": "less_auto_01",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 1: Giới thiệu vật liệu Nhựa, Composite & Phác thảo ý tưởng",
    "slug": "gioi-thieu-vat-lieu-nhua-composite-phac-thao",
    "description": "Tổng quan tính chất cơ lý hóa của nhựa và composite. Phác thảo ý tưởng cơ bản trên AutoCAD.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 45,
    "order": 1,
    "isFreePreview": true,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_02",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 2: Dựng hình chi tiết Nhựa 3D với Autodesk Inventor",
    "slug": "dung-hinh-chi-tiet-nhua-3d-inventor",
    "description": "Thực hành các công cụ thiết kế khối, bề mặt phức tạp, thiết kế gân gia cường, móc ngàm, boss ép nhựa.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 60,
    "order": 2,
    "isFreePreview": true,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_03",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 3: Phân tích kết cấu chịu lực bằng Nastran In-CAD",
    "slug": "phan-tich-ket-cau-nastran-incad",
    "description": "Khai báo thông số vật liệu nhựa/composite dị hướng, chia lưới FEA, phân tích ứng suất và tối ưu khối lượng.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 75,
    "order": 3,
    "isFreePreview": true,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_04",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 4: Thiết kế khuôn ép nhựa với Inventor Mold Design",
    "slug": "thiet-ke-khuon-ep-nhua-mold-design",
    "description": "Tách lõi/lòng khuôn, bố trí lay-out khuôn nhiều cavity, thiết kế kênh dẫn, cổng phun, hệ thống làm mát và pin đẩy.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 90,
    "order": 4,
    "isFreePreview": true,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_05",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 5: Mô phỏng dòng chảy và dự đoán khuyết tật bằng Moldflow",
    "slug": "mo-phong-dong-chay-khuyet-tat-moldflow",
    "description": "Sử dụng Moldflow Insight để dự đoán cong vênh (Warpage), rỗ khí (Air trap), đường nứt (Weld line) và chu kỳ ép khuôn.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 85,
    "order": 5,
    "isFreePreview": true,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_06",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 6: Phân tích đứt gãy Composite nâng cao với Helius PFA & Nastran",
    "slug": "phan-tich-dut-gay-composite-helius-nastran",
    "description": "Tích hợp Helius PFA vào Nastran để mô phỏng hiện tượng tách lớp (delamination) và đứt gãy sợi của vật liệu composite.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 85,
    "order": 6,
    "isFreePreview": false,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_07",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 7: Xử lý bề mặt CAD khuôn phức tạp với PowerShape",
    "slug": "xu-ly-be-mat-khuon-powershape",
    "description": "Tiếp nhận file CAD từ các nguồn khác nhau, sửa lỗi hở mặt, tạo mặt phân khuôn (Parting Surface) cho các chi tiết nhựa phức tạp.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 60,
    "order": 7,
    "isFreePreview": false,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_08",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 8: Lập trình gia công khuôn CNC 3-5 trục với PowerMill",
    "slug": "lap-trinh-gia-cong-khuon-powermill",
    "description": "Tạo đường chạy dao thô (Roughing) và tinh (Finishing) tốc độ cao cho lồng khuôn, mô phỏng tránh va chạm trên máy phay 5 trục.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 110,
    "order": 8,
    "isFreePreview": false,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_09",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 9: Tối ưu khối lượng bằng Generative Design trên Fusion",
    "slug": "toi-uu-generative-design-fusion",
    "description": "Thiết lập điều kiện biên và tải trọng để Fusion tự động tạo ra hàng loạt phương án thiết kế khung vỏ bọc nhựa siêu nhẹ, siêu cứng.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 50,
    "order": 9,
    "isFreePreview": false,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_10",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 10: In 3D vật liệu Nhựa/Composite với Netfabb",
    "slug": "in-3d-composite-netfabb",
    "description": "Sửa lỗi STL, cắt ghép mẫu lớn, tạo cấu trúc Lattice bên trong để giảm lượng vật liệu và chuẩn bị dữ liệu xuất cho máy in 3D.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 65,
    "order": 10,
    "isFreePreview": false,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },
  {
    "id": "less_auto_11",
    "courseId": "course_autodesk_plastic_composite",
    "title": "Bài 11: Quản lý vòng đời sản phẩm & Cộng tác với Autodesk Vault",
    "slug": "quan-ly-du-lieu-autodesk-vault",
    "description": "Lưu trữ tập trung file CAD, quản lý sửa đổi (Revision Control) và phối hợp nhóm thiết kế - gia công - phân tích đồng bộ.",
    "videoUrl": "https://www.youtube.com/embed/ScMzIvxBSi4",
    "duration": 40,
    "order": 11,
    "isFreePreview": false,
    "materialIds": [],
    "createdAt": "2026-08-21T08:00:00Z"
  },

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
    "id": "prod_do_an_chi_tiet_may",
    "title": "Đồ án Chi tiết máy chung",
    "slug": "do-an-chi-tiet-may-chung",
    "description": "Đồ án chi tiết máy. Công cụ tính toán là EngineeringPaper.xyz và file bản vẽ 3D/drawing lập trình bằng Inventor.",
    "shortDescription": "Công cụ tính toán là EngineeringPaper.xyz và file bản vẽ 3D/drawing lập trình bằng Inventor.",
    "highlights": ["Công cụ tính toán EngineeringPaper.xyz", "File 3D Inventor lập trình sẵn", "Xuất tự động sang bản vẽ Drawing"],
    "includedFiles": ["EngineeringPaper.xyz", "3D inventor lập trình sẵn và xuất sang drawing"],
    "accessType": "FREE",
    "productType": "PROJECT",
    "projectType": "Hộp giảm tốc",
    "specialtyIds": [
      "spec_manufacturing",
      "spec_cad_cae"
    ],
    "softwareIds": [
      "soft_inventor"
    ],
    "fileTypes": [
      "EPXYZ",
      "IAM",
      "IPT",
      "DWG"
    ],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Đồ án Chi tiết máy chung",
    "metaDescription": "Tải đồ án Chi tiết máy chung: công cụ tính toán EngineeringPaper.xyz và file bản vẽ 3D/drawing lập trình bằng Inventor.",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-25T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": [
      {
        "id": "f_hgt_chung_001",
        "productId": "prod_do_an_chi_tiet_may",
        "fileName": "DoAn_ChiTietMay_Chung.zip",
        "storagePath": "private/products/prod_do_an_chi_tiet_may/f_hgt_chung_001/DoAn_ChiTietMay_Chung.zip",
        "fileType": "ZIP",
        "fileSize": 44670000,
        "contentType": "application/zip",
        "version": "1.0.0",
        "checksum": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        "createdAt": "2026-08-25T08:00:00Z",
        "updatedAt": "2026-08-28T07:00:00Z"
      }
    ]
  },
  {
    "id": "prod_sach_giao_trinh",
    "title": "Sách giáo trình",
    "slug": "sach-giao-trinh",
    "description": "Sách giáo trình chuyên ngành cơ khí.",
    "shortDescription": "Sách giáo trình chuyên ngành cơ khí.",
    "highlights": ["Đầy đủ kiến thức", "Định dạng PDF"],
    "includedFiles": ["Sách giáo trình PDF"],
    "accessType": "FREE",
    "productType": "DRAWING",
    "projectType": "Bản vẽ kỹ thuật",
    "specialtyIds": ["spec_manufacturing"],
    "softwareIds": [],
    "fileTypes": ["PDF"],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Sách giáo trình",
    "metaDescription": "Sách giáo trình cơ khí",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-25T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": []
  },
  {
    "id": "prod_tool_latex",
    "title": "Tool trình bày Latex",
    "slug": "tool-trinh-bay-latex",
    "description": "Công cụ và template hỗ trợ trình bày báo cáo, đồ án bằng LaTeX chuẩn form.",
    "shortDescription": "Template báo cáo, đồ án chuẩn LaTeX.",
    "highlights": ["Template LaTeX chuẩn Bách Khoa", "Tích hợp sẵn package cần thiết", "Dễ dàng tùy chỉnh"],
    "includedFiles": ["Template LaTeX", "Hướng dẫn sử dụng"],
    "accessType": "FREE",
    "productType": "CALCULATION",
    "projectType": "Khác",
    "specialtyIds": ["spec_manufacturing"],
    "softwareIds": [],
    "fileTypes": ["ZIP", "TEX", "PDF"],
    "isPublished": true,
    "isFeatured": true,
    "metaTitle": "Tool trình bày Latex",
    "metaDescription": "Công cụ trình bày Latex",
    "lastEditorUid": "usr_admin_001",
    "createdAt": "2026-08-25T08:00:00Z",
    "updatedAt": "2026-08-28T07:00:00Z",
    "files": []
  }
];

export const videos = syncedVideos;

