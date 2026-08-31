# Engineering Workspace — Không gian làm việc Kỹ thuật

## Hệ thống này làm gì?

Engineering Workspace là hệ thống **tự động hóa tính toán kỹ thuật cơ khí**
cho đồ án và dự án thiết kế.

Hệ thống sẽ:
- ✅ Nhận yêu cầu thiết kế từ người dùng (ngôn ngữ tự nhiên)
- ✅ Tự động chuyển đổi thành dữ liệu cấu trúc
- ✅ Tự động tính toán theo tiêu chuẩn TCVN, ISO
- ✅ Tự động tạo file Excel có đầy đủ bảng tính, công thức, đơn vị
- ✅ Tự động tạo báo cáo LaTeX/PDF
- ✅ Tự động kiểm tra kết quả (PASS/FAIL theo tiêu chuẩn)

## Người dùng cần làm gì?

Chỉ cần **mô tả yêu cầu thiết kế**, ví dụ:

> "Thiết kế sơ bộ trục truyền công suất 7.5 kW,
> n = 1450 vòng/phút, vật liệu thép 45."

## Người dùng KHÔNG CẦN biết

- ❌ Ô nào cần điền trong Excel
- ❌ Công thức nào cần nhập
- ❌ Cách format bảng tính
- ❌ Cách map cột/hàng
- ❌ Cách paste kết quả vào Excel

> **Excel là báo cáo đầu ra tự động, không phải công cụ tính toán thủ công.**

## Pipeline

```
Người dùng mô tả yêu cầu (tiếng Việt)
        ↓
AI chuyển thành EngineeringCalculationRequest (JSON)
        ↓
Python kiểm tra dữ liệu (Pydantic + Pint)
        ↓
Python tính toán (module registry)
        ↓
EngineeringCalculationResult (JSON)
        ↓
Excel Builder (openpyxl) → .xlsx
LaTeX Generator (Jinja2) → .pdf
EP.xyz Exporter → .epxyz
        ↓
Người dùng mở file, review kết quả
```

## Vai trò của từng thành phần

| Thành phần | Vai trò |
|---|---|
| **AI** | Hiểu yêu cầu, cấu trúc dữ liệu — KHÔNG tính toán |
| **Python** | Tính toán chính xác, kiểm tra, xuất kết quả |
| **Excel** | Đầu ra tự động — người dùng chỉ đọc |
| **LaTeX** | Báo cáo PDF chuyên nghiệp |
| **EngineeringPaper.xyz** | Kiểm chứng độc lập (tùy chọn) |

## Cấu trúc thư mục

```
engineering-workspace/
├── server.py            # MCP server (orchestration)
├── requirements.txt     # Python dependencies
├── README.md            # File này
│
├── contracts/           # Pydantic data contracts
│   ├── request.py       # EngineeringCalculationRequest
│   └── result.py        # EngineeringCalculationResult
│
├── engine/              # Calculation engine
│   ├── validator.py     # Input validation
│   ├── units.py         # Pint unit system
│   └── registry.py      # Module registry
│
├── modules/             # Calculation modules (future)
├── excel/               # Excel generation (future)
├── latex/               # LaTeX reports (future)
├── epxyz/               # EP.xyz integration (future)
└── tests/               # Python tests
```

## Cài đặt

```bash
# Tạo virtual environment (đã có sẵn tại root)
cd ..
python -m venv .venv

# Activate
.venv\Scripts\activate

# Cài dependencies
pip install -r engineering-workspace/requirements.txt

# Chạy tests
cd engineering-workspace
python -m pytest tests/ -v
```

## Bảo mật

- ❌ Không sử dụng `eval()` hoặc `exec()`
- ❌ Không thực thi lệnh shell từ user input
- ❌ Không truy cập filesystem tùy ý
- ✅ Chỉ module đã đăng ký mới chạy được
- ✅ Tất cả input đều được validate

## Modules (Kế hoạch)

| Module | Trạng thái | Phase |
|---|---|---|
| `shaft_design` — Thiết kế trục | 📋 PLANNED | 14C |
| `gear_design` — Thiết kế bánh răng | 📋 PLANNED | 14D+ |
| `bolt_analysis` — Phân tích bu-lông | 📋 PLANNED | 14D+ |
| `bearing_selection` — Chọn ổ lăn | 📋 PLANNED | 14D+ |
| `belt_drive` — Bộ truyền đai | 📋 PLANNED | Future |
| `chain_drive` — Bộ truyền xích | 📋 PLANNED | Future |
