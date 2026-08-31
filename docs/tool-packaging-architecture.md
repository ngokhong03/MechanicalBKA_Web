# MechanicalBKA — Tool Packaging & Product Architecture Specification

> **Project**: MechanicalBKA Engineering Automation Store  
> **Phase**: 14D — Architecture & Audit  
> **Status**: APPROVED ARCHITECTURAL SPECIFICATION  
> **Date**: 2026-08-31  

---

## 1. Executive Summary & Business Direction

MechanicalBKA is an **Engineering Automation Store** designed to create, package, and commercially distribute high-quality mechanical engineering software, calculation templates, CAD assets, and automated engineering reports.

### The Commercial Lifecycle
```
BUILD ENGINEERING TOOL
        ↓
   PACKAGE TOOL (Standard Archive + manifest.json)
        ↓
 CREATE PRODUCT LISTING (Admin CMS / Store Catalog)
        ↓
 DEMO VIDEO & TECHNICAL DOCS
        ↓
  CUSTOMER PAYMENT (Integrated Checkout)
        ↓
    ENTITLEMENT (Deterministic User ↔ Product Grant)
        ↓
  SECURE DOWNLOAD (Signed Storage URLs / Checksum Verified)
        ↓
 CUSTOMER USES TOOL (Standalone Execution / Automation)
```

MechanicalBKA is **NOT** a massive monolithic cloud-computation platform. Instead, it is an **ecosystem of independently developed, independently tested, and independently packageable commercial products** backed by shared Python calculation infrastructure and a secure eCommerce distribution platform.

---

## 2. System Architecture & Component Boundaries

The overall ecosystem is divided into four cleanly decoupled layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. MECHANICALBKA ECOMMERCE STORE (React 19 + Vite 8 + Firestore)       │
│    - Storefront Catalog, Search & Filter (Specialty, Software, Type)   │
│    - Product Detail Page (Highlights, Included Files, Requirements)    │
│    - Cart, Checkout, Order Processing & Customer Library               │
│    - Admin CMS (Product & File Management)                             │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│ 2. FIREBASE CLOUD BACKEND (Cloud Functions v2 + Cloud Storage)         │
│    - Server-side Price Verification                                    │
│    - Deterministic Entitlements: `${uid}_product_${productId}`         │
│    - Secure Download Endpoint (5-min exp Signed URLs, Private Storage) │
│    - Download Audit Logging (Zero storagePath leakage to client)       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│ 3. ENGINEERING WORKSPACE (Developer Engine & Local Shared Infra)       │
│    - Shared Core: Units (Pint), Validator, Contracts (result.py SSOT)  │
│    - Generators: Excel Builder (openpyxl), LaTeX Generator (Jinja2)    │
│    - Exporters: EngineeringPaper.xyz Exporter                          │
│    - Packaging CLI & Automation Scripts                                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│ 4. STANDALONE TOOL PACKAGES (The Sold Artifacts)                       │
│    - Python Standalone Tools (GUI / CLI with bundled runner / venv)    │
│    - Automated Excel Workbooks (openpyxl generated, protected formulas)│
│    - EngineeringPaper.xyz Documents & Interactive Templates            │
│    - Full Project Suites (CAD + Excel + Thuyết minh + Tool)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Standard Tool Package Specification

Every commercial tool distributed through MechanicalBKA must conform to a standardized package structure.

### 3.1 Directory Structure Template

```
shaft-design-v1.0.0/
├── manifest.json                  # Machine-readable product & tool metadata
├── README.md                      # Human-readable instructions & quick start
├── LICENSE.txt                    # Commercial end-user license agreement (EULA)
├── CHANGELOG.md                   # Release notes and version history
├── app/                           # Core executable / runner (for Python tools)
│   ├── main.py                    # Entry point
│   ├── run_tool.bat               # One-click Windows runner
│   ├── run_tool.sh                # Linux/macOS runner
│   └── requirements.txt           # Explicit dependencies
├── templates/                     # Calculation and document templates
│   ├── excel/
│   │   └── shaft_calc_template.xlsx
│   ├── latex/
│   │   └── report_template.tex
│   └── epxyz/
│       └── shaft_sizing.epxyz
├── examples/                      # Verified engineering calculation examples
│   ├── example_1_reducer_shaft.json
│   └── example_1_output.xlsx
└── docs/                          # User manuals and theoretical references
    ├── User_Guide_VI.pdf
    └── Theoretical_Background.pdf
```

### 3.2 Product Variants Supported

| Product Variant | Package Contents | Execution Model |
| :--- | :--- | :--- |
| **Python Automation Tool** | `app/`, `manifest.json`, `docs/`, `run_tool.bat` | Standalone Python execution or bundled runner |
| **Excel Automation Workbook** | `.xlsx` (pre-formatted with validation & formulas), `docs/` | Microsoft Excel 2016+ / WPS Office |
| **EngineeringPaper.xyz Item** | `.epxyz` files, calculation sheets, PDF reference | Web browser (EngineeringPaper.xyz app) |
| **Complete Engineering Suite** | CAD (3D + 2D) + Excel + Report (Word/PDF) + Tool | Comprehensive engineering deliverable |

---

## 4. Manifest JSON Schema Specification

The `manifest.json` file is the machine-readable descriptor packaged at the root of every distribution archive.

### 4.1 Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MechanicalBKAToolManifest",
  "type": "object",
  "required": [
    "manifestVersion",
    "productId",
    "toolId",
    "version",
    "name",
    "packageType",
    "entryPoint",
    "compatibility",
    "files"
  ],
  "properties": {
    "manifestVersion": { "type": "string", "enum": ["1.0.0"] },
    "productId": { "type": "string", "description": "Firestore product ID linking to store" },
    "toolId": { "type": "string", "description": "Internal engineering tool identifier" },
    "version": { "type": "string", "description": "Semantic version of this tool release (e.g., 1.2.0)" },
    "name": { "type": "string", "description": "Product display name in Vietnamese" },
    "nameEn": { "type": "string", "description": "Product display name in English" },
    "packageType": {
      "type": "string",
      "enum": ["PYTHON_TOOL", "EXCEL_WORKBOOK", "EPXYZ_SHEET", "COMPLETE_SUITE", "DOCUMENTATION"]
    },
    "category": { "type": "string", "enum": ["SHAFT", "GEAR", "BEARING", "FASTENER", "BELT", "CHAIN", "GENERAL"] },
    "description": { "type": "string" },
    "author": { "type": "string", "default": "MechanicalBKA Team" },
    "license": { "type": "string", "default": "MechanicalBKA Commercial Single-User License" },
    "entryPoint": {
      "type": "object",
      "properties": {
        "windows": { "type": "string", "example": "app/run_tool.bat" },
        "linux": { "type": "string", "example": "app/run_tool.sh" },
        "python": { "type": "string", "example": "app/main.py" },
        "file": { "type": "string", "example": "templates/excel/shaft_calc_template.xlsx" }
      }
    },
    "compatibility": {
      "type": "object",
      "required": ["os", "requirements"],
      "properties": {
        "os": { "type": "array", "items": { "type": "string" }, "example": ["Windows 10", "Windows 11", "Ubuntu 22.04+"] },
        "pythonVersion": { "type": "string", "example": ">=3.10" },
        "softwareRequirements": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Microsoft Excel 2016+", "Autodesk Inventor 2024 (Optional)"]
        }
      }
    },
    "inputs": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "unit", "description"],
        "properties": {
          "name": { "type": "string" },
          "unit": { "type": "string" },
          "description": { "type": "string" },
          "defaultValue": { "type": ["number", "string"] }
        }
      }
    },
    "outputs": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "unit", "description"],
        "properties": {
          "name": { "type": "string" },
          "unit": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "standards": {
      "type": "array",
      "items": { "type": "string" },
      "example": ["TCVN 1065:2004", "Trịnh Chất - Tính toán thiết kế CTTM"]
    },
    "files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["path", "sha256"],
        "properties": {
          "path": { "type": "string" },
          "sizeBytes": { "type": "integer" },
          "sha256": { "type": "string" }
        }
      }
    }
  }
}
```

### 4.2 Field Rationale Table

| Field | Purpose & Business Value |
| :--- | :--- |
| `productId` | Uniquely maps the downloadable archive to the Firestore product catalog. |
| `version` | Enables automatic update notifications and ensures reproducible engineering audits. |
| `packageType` | Informs the UI how to display instructions (e.g. "Open in Excel" vs "Run Python"). |
| `entryPoint` | Guarantees friction-free one-click launch for non-technical mechanical engineers. |
| `compatibility` | Prevents customer frustration by explicitly listing required OS and software before purchase. |
| `inputs` / `outputs` | Documents exact variable specifications without requiring source code inspection. |
| `standards` | Cites authoritative engineering standards for design defense and compliance. |
| `files[].sha256` | Guarantees tamper-detection and integrity verification during download. |

---

## 5. Product Catalog & Classification Strategy

### 5.1 Recommendation on Product Types
The existing `productType` enumeration (`PROJECT`, `CAD_PROJECT`, `DRAWING`, `CALCULATION`, `TOOL`, `TEMPLATE`, `DOCUMENT`, `OTHER`) is fully adequate for top-level storefront taxonomy.

To avoid breaking existing routes and admin filters, we maintain `productType` and introduce a lightweight `deliveryType` attribute:

```typescript
// Top-Level Commercial Type (Maintained)
type ProductType = 
  | 'PROJECT'       // Đồ Án Chi Tiết Máy
  | 'CAD_PROJECT'   // Bộ File CAD 3D
  | 'DRAWING'       // Bản Vẽ Kỹ Thuật
  | 'CALCULATION'   // Bảng Tính Toán
  | 'TOOL'          // Tool Kỹ Thuật
  | 'TEMPLATE'      // Template Đồ Án
  | 'DOCUMENT'      // Tài Liệu Kỹ Thuật
  | 'OTHER';

// Delivery & Packaging Classification (Additive)
type DeliveryType = 
  | 'PYTHON_STANDALONE'  // Standalone executable / Python package
  | 'EXCEL_AUTOMATION'   // Automated openpyxl calculation workbook
  | 'EPXYZ_SHEET'        // EngineeringPaper.xyz interactive sheet
  | 'STATIC_ARCHIVE'     // Standard CAD / DWG / PDF ZIP bundle
  | 'COMPLETE_BUNDLE';   // Full project including CAD + Excel + Tool
```

---

## 6. EngineeringPaper.xyz Product Line Architecture

EngineeringPaper.xyz products are treated as a **distinct commercial product category**:

1. **Independent Product Nature**: Customers can buy standalone `.epxyz` interactive calculation notebooks for educational or professional design checks without requiring Python installed.
2. **Coexistence with Python Engine**: The Python calculation engine exports `.epxyz` files as an output generator (Phase 14H), but `.epxyz` packages can also be created manually as premium verified templates.
3. **Delivery Flow**: Sold as `.epxyz` files packaged with PDF documentation and example problem statements.

---

## 7. AI Role & Boundaries

```
                 ┌─────────────────────────────┐
                 │       CUSTOMER / USER       │
                 └──────────────┬──────────────┘
                                │ Natural language inquiry
                                ▼
                 ┌─────────────────────────────┐
                 │      AI ORCHESTRATOR        │
                 │ - Identifies target tool    │
                 │ - Extracts & validates args │
                 │ - Explains assumptions      │
                 │ - DOES NOT DO MATH          │
                 └──────────────┬──────────────┘
                                │ Structured Request (JSON)
                                ▼
                 ┌─────────────────────────────┐
                 │  DETERMINISTIC CALCULATION  │
                 │  (Python Verified Module)   │
                 └──────────────┬──────────────┘
                                │ Result Contract (SSOT)
                                ▼
                 ┌─────────────────────────────┐
                 │   EXCEL / PDF / EPXYZ OUT   │
                 └─────────────────────────────┘
```

### Model Context Protocol (MCP) Evaluation
- **MCP as Developer Infrastructure**: **HIGH PRIORITY**. Exposing engineering calculation tools via MCP allows AI coding agents and local assistants to run verified calculations and generate reports during development.
- **MCP as Customer-Facing Feature**: **OPTIONAL / FUTURE**. Most end customers interact via Excel, standalone GUI/CLI, or direct web UI download. MCP server integration is an advanced feature for AI power users.

---

## 8. Excel Automation Strategy

The customer is an engineering user, **not an Excel macro programmer**. Excel outputs generated by Python via `openpyxl` must follow these rules:

1. **Structured Layout**:
   - **Sheet 1 (`Thong_So_Dau_Vao`)**: Clear input cells with background styling and unit annotations.
   - **Sheet 2 (`Qua_Trinh_Tinh_Toan`)**: Step-by-step formula trace matching textbook standard format.
   - **Sheet 3 (`Ket_Qua_Kiem_Nghiem`)**: Final results with conditional formatting (Green = PASS, Red = FAIL).
   - **Sheet 4 (`Gia_Thiet_Tieu_Chuan`)**: Applied design assumptions and cited standards.
2. **Formula Integrity**: Result sheets use cell protection to prevent accidental formula corruption.
3. **No VBA Requirement**: Built with standard openpyxl formulas and conditional formatting, eliminating macro security warnings.

---

## 9. Versioning Strategy

A five-tier semantic versioning hierarchy ensures full traceability:

```
Tool Version (e.g. Shaft Tool v1.2.0)
     ├── Engine Core Version (v0.1.0)
     ├── Data Contract Version (v1.0.0)
     ├── Excel Template Version (v1.1.0)
     └── Store Product Version (v1.2.0)
```

- **Manifest**: Contains `version` (Tool Release) and `manifestVersion`.
- **Product Metadata in Firestore**: Contains `version` and `files[].version`.
- **Calculation Result**: `metadata.engineVersion` and `metadata.moduleVersion`.
- **Audit Logs**: Records the specific `fileVersion` downloaded by the customer.

---

## 10. Update & Release Strategy

1. **Deterministic Entitlements**: Entitlement is granted at the product level (`${uid}_product_${productId}`).
2. **Version Upgrades**: When a developer uploads a new version (e.g., v1.1.0 replacing v1.0.0):
   - Admin CMS updates the active file record under `products/{productId}/files/{fileId}`.
   - Any customer who already owns the product automatically downloads the latest verified version from their **Library** (`/library`) or Product Detail page at no extra charge.
   - Version history and changelog are visible in `CHANGELOG.md` inside the package.

---

## 11. Security Model

The packaging architecture integrates seamlessly with MechanicalBKA's existing zero-trust security controls:

1. **Zero Storage Path Exposure**: Client apps never see Google Cloud Storage bucket paths. Downloads always pass through `/api/download` Cloud Function.
2. **Time-Limited Signed URLs**: URLs expire in 5 minutes and are bound to specific `responseDisposition` filenames.
3. **SHA-256 Checksum Verification**: Every file in `manifest.json` and Firestore has a SHA-256 checksum for integrity verification.
4. **Server-Side Authorization**: Entitlement verification occurs strictly in Cloud Functions backend before generating signed URLs.

---

## 12. Developer Workflow: Tool to Commercial Product

```
1. DEVELOP MODULE
   Write calculation logic in engineering-workspace/modules/shaft_design.py

2. WRITE CONTRACT TESTS
   Test module against EngineeringCalculationResult SSOT (100% test pass)

3. RUN PACKAGING SCRIPT
   Execute: python scripts/package_tool.py --module shaft_design --version 1.0.0
   -> Generates shaft-design-v1.0.0.zip with verified manifest.json and checksums

4. UPLOAD & LIST PRODUCT
   In Admin CMS (AdminProducts.jsx):
   - Create product listing with highlights, price, software compatibility
   - Upload shaft-design-v1.0.0.zip to private Storage
   - Publish to Storefront

5. ATTACH DEMO VIDEO
   Embed YouTube demonstration video URL in product documentation.
```

---

## 13. Customer Workflow

```
1. DISCOVER & EVALUATE
   Browse Store (/store) -> View ProductDetail (/product/shaft-design-tool)
   Watch demo video, review requirements (Excel 2016+, Windows 10/11)

2. PURCHASE & INSTANT ACCESS
   Add to Cart -> Checkout -> QR Code Payment -> Order Completed
   Instant Entitlement created (${uid}_product_prod_shaft_tool)

3. ONE-CLICK DOWNLOAD
   Download verified ZIP from Product page or My Library (/library)

4. UNPACK & RUN
   Extract ZIP -> Double-click run_tool.bat or open calculation.xlsx
   Instant results without manual configuration.
```

---

## 14. Recommended First Commercial Tool: Shaft Design MVP

The **Shaft Design Tool (`shaft_design`)** is the **ideal First MVP Commercial Tool** for Phase 14 because:

1. **Complete Engineering Workflow**: Covers preliminary sizing ($d_{sb}$), torsion & bending moment diagrams, fatigue safety factor checks ($s_\sigma, s_\tau, s$), and standard keyway/bearing shoulder sizing.
2. **Multi-Output Validation**: Naturally outputs both Excel design calculation sheets, LaTeX/PDF engineering reports, and CAD dimensional parameters.
3. **High Market Demand**: Shaft calculation is the core of every Gearbox and Power Transmission design course in mechanical engineering universities and industry.
4. **Validates Full Pipeline**: Tests the entire pipeline (Contract SSOT → Python Engine → Packaging → Store Listing → Secure Download).
