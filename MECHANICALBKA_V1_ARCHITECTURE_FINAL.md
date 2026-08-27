# TÀI LIỆU KIẾN TRÚC & PHÂN TÍCH CHUẨN HÓA CUỐI CÙNG: MECHANICALBKA V1

Tài liệu này trình bày toàn bộ kết quả phân tích hệ sinh thái nội dung từ kênh YouTube của tác giả và website tham khảo [Vertanux1](http://www.vertanux1.com), đồng thời đề xuất kiến trúc hệ thống chuẩn hóa cuối cùng, cơ sở dữ liệu Firestore, sitemap, giải pháp bảo mật và lộ trình triển khai chi tiết cho website mới **MechanicalBKA**.

---

## PHẦN 1 — PHÂN TÍCH YOUTUBE (@trongbka)

Kênh YouTube [@trongbka](https://youtube.com/@trongbka) đóng vai trò là lõi nội dung giảng dạy trực quan và động lực tương tác cộng đồng của thương hiệu.

### 1. Chủ đề chính của kênh
Kênh tập trung vào đào tạo kỹ thuật chuyên sâu thuộc các lĩnh vực:
*   **Kỹ thuật Polymer & Composite**: Khoa học vật liệu nhựa, cơ học chất lỏng polymer, công nghệ đùn và ép phun.
*   **Thiết kế khuôn mẫu (Mold Design)**: Chuyên sâu về thiết kế khuôn ép phun nhựa (Plastic Injection Mold).
*   **Gia công cơ khí & Chế tạo máy**: Công nghệ chế tạo máy, lập trình gia công (CNC, tiện, phay), dụng cụ cắt gọt.
*   **Cơ học dập tạo hình**: Thiết kế khuôn dập tấm và công nghệ biến dạng kim loại.

### 2. Các nhóm nội dung (Playlists) chính
Nội dung kênh được cấu trúc theo các học phần (Modules) đại học chuyên sâu:
*   **Module 1: Chế tạo máy** (CNC, dụng cụ cắt, quy trình công nghệ gia công).
*   **Module 2: Công nghệ và khuôn dập tạo hình** (Dập tấm, thiết kế chày cối dập).
*   **Module 5.1: Plastic and Composite Materials** (Khoa học vật liệu polymer).
*   **Module 5.2: Composite Manufacturing Technology** (Công nghệ chế tạo composite).
*   **Module 5.3: Mechanics of Polymeric Liquids** (Cơ chất lỏng polymer, dòng chảy nhựa).
*   **Module 5.4: Polymer Extrusion Process and Equipments** (Quy trình và thiết bị đùn nhựa).
*   **Module 5.5: Polymer Injection Molding Process and Equipment** (Quy trình và thiết bị ép phun).
*   **Module 5.6: Project in Mold for Plastics** (Đồ án/Dự án thiết kế khuôn nhựa).
*   **Module 5.7: Mechanics of Plastic and Composite Materials** (Cơ học vật liệu nhựa và composite).

### 3. Phần mềm sử dụng chuyên ngành
*   **Autodesk Inventor / Mold Design**: Thiết kế chi tiết 3D, lắp ráp khuôn, tách lòng khuôn (core/cavity).
*   **SOLIDWORKS**: Thiết kế cơ khí, mô hình hóa sản phẩm.
*   **X-TIMON**: Mô phỏng phân tích dòng chảy nhựa trong khuôn (CAE Injection Molding).

### 4. Đối tượng người dùng mục tiêu
*   **Sinh viên ngành Cơ khí/Chế tạo máy/Vật liệu**: Học tập lý thuyết và làm đồ án tốt nghiệp.
*   **Kỹ sư thiết kế khuôn (Mold Designers)**: Cần tài liệu nâng cao tay nghề thực tế và tra cứu thông số kỹ thuật.
*   **Kỹ sư Polymer/Composite**: Nghiên cứu công nghệ sản xuất và cơ học dòng chảy nhựa.

### 5. Chiến lược tích hợp nội dung lên Website
*   **Đưa vào Website**:
    *   Các file bài tập thực hành CAD tương ứng với video.
    *   Slide bài giảng lý thuyết (PDF), đề thi trắc nghiệm thử nghiệm.
    *   Metadata của video (Tiêu đề, mô tả ngắn, hình thu nhỏ) để người học dễ tìm kiếm và liên kết chéo với tài liệu.
*   **Liên kết trực tiếp về YouTube**:
    *   Trình phát video trực tiếp nhúng (YouTube Embedded Player) trong các bài học.
    *   Nút chuyển hướng tới danh sách phát (Playlist) gốc trên YouTube để tối ưu băng thông máy chủ và tăng tương tác (Subscribe/View) cho kênh của tác giả.

---

## PHẦN 2 — PHÂN TÍCH WEBSITE VERTANUX1

Website [Vertanux1](http://www.vertanux1.com) là một nền tảng chia sẻ học liệu CAD/CAE/CAM miễn phí lớn của tác giả C.F. Sikora. Dưới đây là phân tích cấu trúc và đề xuất cải tiến cho **MechanicalBKA**.

### 1. Phân tích cấu trúc hiện tại
*   **Sitemap & Navigation**: Cực kỳ đơn giản và phẳng (Home, Instructional Manuals, Part Files, Videos, Exams, About, Contact).
*   **Tổ chức học liệu**:
    *   Tổ chức theo chiều ngang (Software-centric). Mỗi phần mềm có một danh mục riêng chứa tất cả các hướng dẫn từ cơ bản đến nâng cao.
    *   Một bài tập (ví dụ: Exercise 5) được giải bằng nhiều phần mềm khác nhau (Inventor, Creo, NX, SolidWorks), dùng chung bản vẽ kỹ thuật PDF nhưng khác file CAD nguồn.
*   **Lưu trữ & Tải file**: Toàn bộ tài liệu PDF hướng dẫn, đề thi và file CAD (nén trong file `.zip`) đều được host trên **Google Drive** công cộng.
*   **Video**: Nhúng danh sách phát YouTube dạng lưới đơn giản.
*   **Thanh toán/Tài khoản**: Không có. Trang hoàn toàn miễn phí, không yêu cầu đăng nhập.

### 2. Định hướng kế thừa và cải tiến cho MechanicalBKA

| Chức năng | Trạng thái trên Vertanux1 | Đề xuất cho MechanicalBKA mới |
| :--- | :--- | :--- |
| **Phân loại học liệu** | Phân theo Software & Course. | **Giữ lại & Nâng cấp**: Kết hợp phân loại theo Chuyên ngành (Specialty) và Phần mềm (Software) thông qua quan hệ nhiều-nhiều. |
| **Học liệu dùng chung** | Một bản vẽ PDF dùng cho nhiều file CAD của các phần mềm khác nhau. | **Giữ lại**: Thiết kế database cho phép một Học liệu (Product/Material) liên kết với nhiều phần mềm và định dạng file khác nhau. |
| **Giao diện & UX** | Cổ điển, thô sơ, dựng bằng GoDaddy Builder, không tương thích tốt trên mobile. | **Cải tiến mạnh mẽ**: Thiết kế Modern Dark Theme chuyên nghiệp, Responsive, tối ưu hóa hiển thị thẻ (card) kỹ thuật, hỗ trợ bộ lọc động (Filter). |
| **Lưu trữ tài liệu** | Host hoàn toàn trên Google Drive công cộng. | **Cải tiến bảo mật**: Chuyển các file trả phí/bảo mật sang Firebase Storage (Private Bucket), quản lý qua Cloud Functions bằng cơ chế truyền tải nhị phân (Server-side Streaming) hoặc cấp link Signed URL tạm thời. |
| **Tài khoản người dùng** | Không có. | **Bổ sung**: Hệ thống đăng nhập/đăng ký (Firebase Auth) để cá nhân hóa lộ trình học, lưu lịch sử học và quản lý học liệu sở hữu. |
| **Thanh toán & Bản quyền** | Không có (Free hoàn toàn). | **Bổ sung**: Cửa hàng học liệu (Store) cho phép mua các khóa học nâng cao hoặc file CAD/Khuôn mẫu độc quyền (Hỗ trợ phân biệt Free, Paid, Owned). |
| **Hệ thống quản trị (CMS)** | Sửa thủ công bằng web builder. | **Bổ sung**: Trang Admin CMS động giúp quản trị viên thêm khóa học, bài học, tải file mới lên mà không cần sửa code nguồn frontend. |

---

## PHẦN 3 — ĐỊNH HƯỚNG MECHANICALBKA MỚI

Nền tảng **MechanicalBKA** mới sẽ định hình là cổng học tập và mua bán học liệu cơ khí trực tuyến chất lượng cao tại Việt Nam.

### 1. Bốn chuyên ngành trọng tâm
1.  **Polymer & Composite**: Đào tạo lý thuyết vật liệu polymer, composite, công nghệ sản xuất nhựa đùn, ép phun.
2.  **Khuôn mẫu & Mold Design**: Thiết kế khuôn ép phun nhựa, khuôn dập, tách khuôn cơ bản và nâng cao.
3.  **Chi tiết máy**: Nguyên lý máy, thiết kế chi tiết máy, công nghệ gia công chế tạo.
4.  **CAD / CAE**: Hướng dẫn dựng hình 3D (CAD) và mô phỏng số học dòng chảy/ứng suất cơ học (CAE).

### 2. Phần mềm giảng dạy chính
*   **Autodesk Inventor**: Dựng hình 3D, xuất bản vẽ thiết kế (định dạng `.ipt`, `.iam`, `.idw`).
*   **Mold Design / Mold Inventor**: Module thiết kế khuôn chuyên nghiệp của Autodesk.
*   **SOLIDWORKS**: Thiết kế chi tiết cơ khí và lắp ráp khuôn máy (định dạng `.sldprt`, `.sldasm`).
*   **X-TIMON**: Phần mềm CAE mô phỏng điền đầy dòng chảy nhựa, tối ưu hóa kênh dẫn và chu kỳ làm nguội khuôn.

---

## PHẦN 4 — XÂY DỰNG SITEMAP MỚI

Hệ thống sitemap của MechanicalBKA được phân cấp rõ ràng phục vụ khách vãng lai, người học có tài khoản và quản trị viên:

### Danh mục đường dẫn (Routes):

*   **Trang công cộng (Public Client Routes):**
    *   `/` : Trang chủ chào mừng, tổng hợp thông tin và tin tức nổi bật.
    *   `/specialties` : Danh sách và giới thiệu 4 chuyên ngành cơ khí trọng tâm.
    *   `/software` : Danh sách các phần mềm kỹ thuật được hỗ trợ.
    *   `/courses` : Danh mục các khóa học, tích hợp tìm kiếm và bộ lọc đa tiêu chí.
    *   `/courses/:slug` : Trang chi tiết giới thiệu lộ trình, đề cương và danh sách bài học của một khóa học.
    *   `/courses/:courseSlug/lessons/:lessonSlug` : Trình học bài trực tuyến (Lesson Viewer), nhúng video YouTube và liên kết tải tài liệu thực hành.
    *   `/store` : Cửa hàng học liệu hiển thị danh sách các sản phẩm (Products) CAD/CAE/PDF.
    *   `/store/:slug` : Chi tiết một sản phẩm học liệu, hiển thị giá cả, mô tả kỹ thuật và danh sách các file đính kèm.
    *   `/videos` : Trang thư viện video, đồng bộ hóa danh sách bài giảng từ kênh YouTube của tác giả.
    *   `/search` : Trang tìm kiếm hợp nhất toàn trang (khóa học, sản phẩm, bài học).
    *   `/cart` : Giỏ hàng mua sắm học liệu/khóa học tạm thời.
    *   `/checkout` : Giao diện thanh toán chuyển khoản thủ công hiển thị QR Code động.
    *   `/auth` : Trang Đăng nhập / Đăng ký tài khoản (hỗ trợ Email/Password và Google Sign-In).

*   **Trang cá nhân của học viên (Student Private Routes):**
    *   `/account` : Trang tổng quan tài khoản cá nhân.
    *   `/account/courses` : Kho lưu trữ các khóa học học viên đã sở hữu/đang tham gia.
    *   `/account/materials` : Kho lưu trữ các sản phẩm học liệu cá nhân đã sở hữu, cung cấp nút tải file bảo mật.
    *   `/account/orders` : Lịch sử và trạng thái các đơn hàng đã đặt.
    *   `/account/orders/:orderId` : Chi tiết hóa đơn, trạng thái thanh toán và thông tin chuyển khoản đối soát.
    *   `/account/settings` : Thiết lập thông tin cá nhân và thay đổi mật khẩu.

*   **Trang dành cho quản trị viên (Admin CMS Routes):**
    *   `/admin` : Dashboard tổng quan chỉ số quản trị (số người dùng, doanh thu, đơn hàng chờ duyệt).
    *   `/admin/courses` : Quản lý CRUD danh mục Khóa học.
    *   `/admin/lessons` : Quản lý CRUD Bài học chi tiết trong từng Khóa học.
    *   `/admin/products` : Quản lý CRUD Sản phẩm học liệu và upload tệp tin nguồn lên Storage.
    *   `/admin/users` : Quản lý cơ sở dữ liệu người dùng, thay đổi vai trò hoặc cấp quyền thủ công.
    *   `/admin/orders` : Danh sách đơn hàng toàn hệ thống, cung cấp nút duyệt thanh toán để kích hoạt entitlement.

---

## PHẦN 5 — KIẾN TRÚC HỌC LIỆU & QUAN HỆ THỰC THỂ (COURSE VS PRODUCT)

Hệ thống quản lý nội dung số của MechanicalBKA phân tách rõ ràng hai khái niệm thực thể: **Khóa học (Course)** và **Sản phẩm (Product)**.

```
     +-----------------+                     +--------------------+
     |     Course      |                     |      Product       |
     | (Lộ trình học)  |                     | (Học liệu tải về)  |
     +--------+--------+                     +---------+----------+
              |                                        |
              | 1 : N                                  | 1 : N
              ▼                                        ▼
     +-----------------+                     +--------------------+
     |     Lesson      |                     |    Product File    |
     | (Bài giảng video|                     | (Tệp tin nhị phân  |
     |   youtubeId)    |                     |  version/checksum) |
     +--------+--------+                     +---------+----------+
              |                                        |
              |            N : N (Liên kết)            |
              +========================================+
```

### 1. Phân biệt thuộc tính
*   **Course (Khóa học):** Đại diện cho lộ trình đào tạo lý thuyết và thực hành có hệ thống. Nó bao gồm nhiều bài học (Lessons) sắp xếp theo thứ tự bài giảng. Khóa học có thể bán trả phí hoặc mở miễn phí.
*   **Product (Sản phẩm học liệu):** Đại diện cho giá trị học liệu số có thể tải xuống. Một Product chứa metadata chung (giá, loại định dạng) và sở hữu một **Subcollection các File tệp tin nhị phân cụ thể**. Một sản phẩm có thể đính kèm vào bài học để học viên tải về hoặc bán độc lập trên Store.
*   **Product File (Tệp tin sản phẩm):** Là tệp tin vật lý thực tế lưu trữ trên Firebase Storage bảo mật. Để kiểm soát tính toàn vẹn, mỗi file được gán kèm trường **Phiên bản (version)** và mã băm toàn vẹn **Checksum (SHA-256)** giúp phát hiện thay đổi và cập nhật học liệu.

### 2. Định nghĩa Quan hệ thực thể
*   Một **Course** chứa danh sách nhiều **Lesson** sắp xếp theo `order`.
*   Một **Lesson** liên kết với nhiều **Product** đính kèm bài học để bổ trợ học tập (thực hành CAD, đọc tài liệu lý thuyết).
*   Một **Product** có thể liên kết chéo với nhiều **Lesson** thuộc các khóa học khác nhau.
*   Một **Product** chứa subcollection `files` đại diện cho một hoặc nhiều tệp tin cụ thể (ví dụ: sản phẩm "Bài tập khuôn dập" chứa file PDF đề bài, file SOLIDWORKS `.sldprt` và file Inventor `.ipt`).

---

## PHẦN 6 — MÔ HÌNH PHÂN QUYỀN TRUY CẬP (ACCESS CONTROL MODEL)

Quyền truy cập nội dung số được Backend kiểm tra chặt chẽ trước khi kết xuất dữ liệu cho trình duyệt.

### 1. Quy tắc phân quyền bài học (Lesson Access Rules)
Quyền xem video và nội dung chi tiết bài học phụ thuộc vào loại tiếp cận khóa học (`accessType` của Course):
*   **Course `accessType = 'FREE'`:** Tất cả các bài học có trạng thái xuất bản (`isPublished=true`) đều được mở tự do cho mọi đối tượng.
*   **Course `accessType = 'PAID'`:**
    *   Bài học có thuộc tính `isFreePreview = true` (Bài học xem thử): Mọi người dùng đều có quyền truy cập.
    *   Bài học có thuộc tính `isFreePreview = false`: Chỉ người dùng đã đăng nhập và sở hữu **Course Entitlement** tương ứng mới có quyền xem.

### 2. Quy tắc phân quyền tải tệp tin (File Download Access Rules)
Mọi tệp tin CAD/PDF học liệu đều được lưu trữ bảo mật tại thư mục private trên Storage. Mọi yêu cầu tải tệp tin bắt buộc phải chuyển tiếp đến Download API để Backend kiểm tra quyền truy cập theo loại của Product (`accessType` của Product):
*   **Product `accessType = 'FREE'` (Miễn phí):** Không yêu cầu entitlement. Backend kiểm tra đúng trạng thái Product `accessType` là `FREE` và tệp tin tồn tại thì lập tức cấp quyền tải file.
*   **Product `accessType = 'PAID'` (Mua lẻ có phí):** Backend yêu cầu người dùng đăng nhập và kiểm tra xem tài khoản có sở hữu **Product Entitlement** tương ứng (có được khi thanh toán thành công đơn hàng mua lẻ sản phẩm).
*   **Product `accessType = 'COURSE_ONLY'` (Chỉ đính kèm khóa học):**
    *   Học viên tuyệt đối không thể mua lẻ sản phẩm này.
    *   Khi người dùng yêu cầu tải file, Backend bắt buộc phải **xác định Course Context (Bối cảnh Khóa học)**: Backend sẽ truy vấn danh sách các `lessons` để tìm các Course ID có đính kèm Product ID này. Sau đó, kiểm tra xem người dùng có sở hữu bất kỳ **Course Entitlement** nào tương ứng với các Course ID đó hay không.
    *   Nếu có: Cấp quyền tải file. Nếu không: Từ chối yêu cầu (403 Forbidden).

---

## PHẦN 7 — BẢO MẬT & PHÂN QUYỀN (RBAC)

Hệ thống quản lý phân quyền (Role-Based Access Control) được bảo mật nghiêm ngặt từ lớp xác thực token, không tin tưởng dữ liệu dưới client.

```
                  +--------------------------------+
                  |         Client Browser         |
                  +---------------+----------------+
                                  |
                                  | Gửi HTTPS request + JWT Token
                                  ▼
                  +--------------------------------+
                  |    Firebase Auth Middleware    |
                  +---------------+----------------+
                                  |
                   Verify Token & | Extract Custom Claims
                                  ▼
            +---------------------+---------------------+
            |                                           |
            | Claims chứa { admin: true }               | Claims thông thường
            ▼                                           ▼
+-----------------------+                   +-----------------------+
|      Vai trò Admin    |                   |     Vai trò Student   |
|  - Quyền tối cao      |                   |  - Chỉ xem hồ sơ      |
|  - CRUD data, duyệt đơn|                   |  - Học và tải file    |
+-----------------------+                   +-----------------------+
```

### 1. Phân cấp xác thực vai trò
*   **Firestore Application Profile:** Giá trị trường `role` tại collection `users` trên Firestore chỉ mang tính chất lưu thông tin hồ sơ hiển thị (Profile Data) giúp Frontend ẩn/hiện các nút giao diện tương ứng (ví dụ: nút vào trang Admin). Trường này **không được phép** sử dụng làm căn cứ xác thực quyền Admin ở Backend.
*   **Firebase Auth Custom Claims:** Quyền Admin thực tế bắt buộc phải được bảo mật bằng cơ chế **Auth Custom Claims** (`{ admin: true }`) được ký số trực tiếp trên JWT ID Token. Backend API và Firestore Security Rules sẽ kiểm tra Custom Claims này để quyết định quyền thao tác ghi.
*   **Chặn cập nhật chéo từ Client:** Firestore Security Rules cấu hình chặt chẽ chỉ cho phép ghi tài liệu tại `/users/{uid}` khi người dùng đăng nhập có `request.auth.uid == uid` và cấm hoàn toàn hành vi tự thay đổi trường `role` từ client để tránh tấn công leo thang đặc quyền.

### 2. Thiết lập Idempotent Entitlement (Quyền sở hữu không lặp lại)
Để đảm bảo tính nhất quán của hệ thống khi duyệt thanh toán thủ công hoặc tự động:
*   Mỗi khi đơn hàng thành công, Backend sẽ khởi tạo tài liệu `entitlements` với ID có định dạng chuẩn hóa bắt buộc:
    
    $$\text{entitlementId} = \{\text{userId}\}\_\{\text{targetType}\}\_\{\text{targetId}\}$$
    
    *Ví dụ:* `usr_90218391283_course_course_inventor_mold_basics`
*   Backend thực hiện thao tác ghi đè an toàn (`set(..., { merge: true })`) lên ID tài liệu này. Nếu có sự cố trùng lặp yêu cầu mạng hoặc Admin bấm duyệt đơn hàng nhiều lần, bản ghi entitlement vẫn giữ nguyên tính duy nhất, hoàn toàn không sinh thêm tài liệu rác gây mâu thuẫn dữ liệu.
*   Mỗi bản ghi entitlement lưu trường `sourceOrderId` để đối soát nguồn gốc cấp quyền trực tiếp với hóa đơn đã thanh toán.

---

## PHẦN 8 — KIẾN TRÚC DOWNLOAD BẢO MẬT & STORAGE

Hệ thống lưu trữ tệp tin nhị phân và phân phối tệp tin được cấu trúc để tối ưu hiệu năng và ngăn chặn rò rỉ dữ liệu.

### 1. Cấu trúc thư mục Storage vật lý
Tất cả các học liệu CAD/CAE/PDF trả phí và khóa học được lưu trữ tại Private Bucket của Firebase Storage theo phân cấp bảo mật nghiêm ngặt:

$$\text{private/products/}\{\text{productId}\}/\{\text{fileId}\}/\{\text{fileName}\}$$

*Ví dụ:* `private/products/mat_exercise_1_parts/file_001/housing_body.ipt`

Mọi quyền truy cập trực tiếp bằng URL cố định (Public URL) tới phân vùng `private/` đều bị chặn đứng 100% bởi Firebase Storage Security Rules.

### 2. Thiết lập Download API & Cơ chế Phân phối file

Tất cả các yêu cầu tải file (bao gồm học liệu FREE) đều bắt buộc đi qua Download API chạy trên Cloud Functions thông qua định dạng URL tham số bắt buộc: `/api/download?productId={productId}&fileId={fileId}`.

```
[ Browser (Client) ]
       │
       │ 1. Gọi API: GET /api/download?productId=XXX&fileId=YYY
       │    (Header Authorization: Bearer <Auth_Token>)
       ▼
[ Download API (Cloud Function) ]
       │
       │ 2. Xác thực Token -> Lấy userId.
       │ 3. Đọc Firestore: Xác minh accessType của Product.
       │ 4. Kiểm tra quyền sở hữu (Entitlement Check) dựa trên targetId/targetType.
       │    - FREE: Cho phép.
       │    - PAID: Đọc entitlement của Product.
       │    - COURSE_ONLY: Xác định Course Context chứa Lesson liên quan -> Check entitlement Course.
       ▼
   Xác minh PASS?
       ├── [ YES ] Môi trường chạy là gì?
       │     ├── LOCAL / EMULATOR: Khởi tạo createReadStream() -> pipe(response) (Streaming)
       │     └── PRODUCTION: Tạo short-lived Signed URL (5 phút) -> Redirect Browser tải trực tiếp
       │
       └── [ NO ] Trả về lỗi 403 Forbidden (Không cấp quyền truy cập)
```

*   **Production Environment (Ưu tiên Signed URL):** Đối với môi trường hoạt động thực tế, Backend sẽ sinh ra một liên kết tạm thời **short-lived Signed URL** (thời hạn ngắn dưới 5 phút) để chuyển hướng trình duyệt (HTTP Redirect 302) tải trực tiếp từ máy chủ Google Cloud Storage. Cơ chế này giảm tải tối đa CPU, RAM và băng thông truyền tải của máy chủ Cloud Functions khi người dùng tải file dung lượng lớn.
*   **Streaming Fallback:** Trong trường hợp tệp tin có dung lượng nhỏ (PDF hướng dẫn) hoặc khi cấu hình service account lỗi không tạo được Signed URL, Backend sử dụng cơ chế Server-side Streaming thông qua `createReadStream()` và `pipe(response)` để tải file về cho học viên dưới dạng luồng dữ liệu thô nhị phân.
*   **Local Emulator (Ưu tiên Server-side Streaming):** Ở môi trường local giả lập, luồng tải sẽ ưu tiên server-side streaming hoàn toàn để tránh lỗi Cors hoặc phân quyền 403 do thiếu Service Account thật.

---

## PHẦN 9 — THIẾT KẾ CƠ SỞ DỮ LIỆU (FIRESTORE SCHEMA)

Dưới đây là cấu trúc cơ sở dữ liệu Firestore được chuẩn hóa, loại bỏ hoàn toàn các trường mâu thuẫn dữ liệu và đồng bộ hóa tiêu chuẩn thời gian.

### 1. Collection `users`
*   **Mục đích**: Lưu trữ thông tin cá nhân và vai trò hiển thị giao diện.
*   **Đường dẫn**: `/users/{uid}`
*   **Các trường dữ liệu**:
    *   `uid` (string): UID của tài khoản.
    *   `email` (string): Địa chỉ email.
    *   `displayName` (string): Tên hiển thị.
    *   `role` (string: `'student'` | `'admin'`): Vai trò hiển thị giao diện.
    *   `createdAt` (timestamp): Thời gian tạo tài khoản.
    *   `updatedAt` (timestamp): Thời gian cập nhật tài khoản.
*   **Ví dụ document**:
    ```json
    {
      "uid": "usr_90218391283",
      "email": "nguyenvan@gmail.com",
      "displayName": "Nguyễn Văn A",
      "role": "student",
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T15:00:00Z"
    }
    ```

### 2. Collection `specialties`
*   **Mục đích**: Quản lý các chuyên ngành cơ khí.
*   **Đường dẫn**: `/specialties/{specialtyId}`
*   **Các trường dữ liệu**:
    *   `id` (string): Mã chuyên ngành.
    *   `name` (string): Tên chuyên ngành.
    *   `slug` (string): Slug chuẩn SEO.
    *   `description` (string): Mô tả tóm tắt.
    *   `order` (number): Thứ tự sắp xếp.
    *   `createdAt` (timestamp): Thời gian tạo.
    *   `updatedAt` (timestamp): Thời gian cập nhật.
*   **Ví dụ document**:
    ```json
    {
      "id": "spec_polymer_composite",
      "name": "Polymer & Composite",
      "slug": "polymer-composite",
      "description": "Lý thuyết cơ học polymer, vật liệu nhựa và quy trình chế tạo composite.",
      "order": 1,
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T08:00:00Z"
    }
    ```

### 3. Collection `software`
*   **Mục đích**: Lưu trữ thông tin phần mềm chuyên ngành.
*   **Đường dẫn**: `/software/{softwareId}`
*   **Các trường dữ liệu**:
    *   `id` (string): Mã phần mềm.
    *   `name` (string): Tên phần mềm.
    *   `slug` (string): Slug chuẩn SEO.
    *   `logoUrl` (string): Link ảnh logo phần mềm.
    *   `description` (string): Mô tả tính năng phần mềm.
    *   `createdAt` (timestamp): Thời gian tạo.
    *   `updatedAt` (timestamp): Thời gian cập nhật.
*   **Ví dụ document**:
    ```json
    {
      "id": "soft_inventor",
      "name": "Autodesk Inventor",
      "slug": "autodesk-inventor",
      "logoUrl": "https://firebasestorage.../inventor_logo.png",
      "description": "Thiết kế cơ khí 3D và tách khuôn nhựa.",
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T08:00:00Z"
    }
    ```

### 4. Collection `courses`
*   **Mục đích**: Lưu trữ thông tin lộ trình khóa học.
*   **Đường dẫn**: `/courses/{courseId}`
*   **Các trường dữ liệu**:
    *   `id` (string): Mã khóa học.
    *   `title` (string): Tiêu đề khóa học.
    *   `slug` (string): Slug chuẩn SEO (ví dụ: `thiet-ke-khuon-co-ban-inventor`).
    *   `description` (string): Mô tả khóa học (Markdown).
    *   `thumbnailUrl` (string): Hình đại diện khóa học.
    *   `specialtyIds` (array of strings): Danh sách ID chuyên ngành liên kết.
    *   `softwareIds` (array of strings): Danh sách ID phần mềm sử dụng.
    *   `price` (number): Giá bán khóa học (0 nếu miễn phí).
    *   `accessType` (string: `'FREE'` | `'PAID'`): Kiểu tiếp cận bài học.
    *   `isPublished` (boolean): Trạng thái hiển thị công khai.
    *   `isFeatured` (boolean): Khóa học nổi bật ngoài trang chủ.
    *   `metaTitle` (string): Tiêu đề SEO.
    *   `metaDescription` (string): Mô tả SEO.
    *   `lastEditorUid` (string): UID của admin chỉnh sửa cuối cùng.
    *   `createdAt` (timestamp): Ngày tạo.
    *   `updatedAt` (timestamp): Ngày cập nhật.
*   **Ví dụ document**:
    ```json
    {
      "id": "course_inventor_mold_basics",
      "title": "Thiết kế Khuôn cơ bản trên Autodesk Inventor",
      "slug": "thiet-ke-khuon-co-ban-inventor",
      "description": "Khóa học hướng dẫn tách lòng khuôn và tạo hệ thống đẩy nhựa...",
      "thumbnailUrl": "https://firebasestorage.../inventor_mold.png",
      "specialtyIds": ["spec_mold_design"],
      "softwareIds": ["soft_inventor"],
      "price": 250000,
      "accessType": "PAID",
      "isPublished": true,
      "isFeatured": true,
      "metaTitle": "Học thiết kế khuôn ép nhựa Autodesk Inventor cơ bản",
      "metaDescription": "Hướng dẫn thiết kế chi tiết lòng khuôn, lõi khuôn và bạc cuống phun nhựa.",
      "lastEditorUid": "usr_admin_001",
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T15:00:00Z"
    }
    ```

### 5. Collection `lessons`
*   **Mục đích**: Quản lý danh mục các bài học trong từng khóa học.
*   **Đường dẫn**: `/lessons/{lessonId}`
*   **Các trường dữ liệu**:
    *   `id` (string): Mã bài học.
    *   `courseId` (string): ID khóa học chứa bài giảng.
    *   `title` (string): Tiêu đề bài học.
    *   `slug` (string): Slug chuẩn SEO (ví dụ: `bai-1-tach-long-khuon-core-cavity`).
    *   `description` (string): Mô tả nội dung bài học.
    *   `order` (number): Thứ tự sắp xếp.
    *   `youtubeVideoId` (string): ID video YouTube (ví dụ: `dQw4w9WgXcQ`). Chỉ lưu ID để Frontend tự dựng mã nhúng.
    *   `materialIds` (array of strings): Danh sách các Product ID đính kèm thực hành.
    *   `isFreePreview` (boolean): Trạng thái cho phép học thử.
    *   `createdAt` (timestamp): Ngày tạo.
    *   `updatedAt` (timestamp): Ngày cập nhật.
*   **Ví dụ document**:
    ```json
    {
      "id": "les_inventor_mold_l1",
      "courseId": "course_inventor_mold_basics",
      "title": "Bài 1: Tách lòng khuôn Core & Cavity",
      "slug": "bai-1-tach-long-khuon-core-cavity",
      "description": "Hướng dẫn nạp chi tiết nhựa và phân tích góc thoát khuôn.",
      "order": 1,
      "youtubeVideoId": "dQw4w9WgXcQ",
      "materialIds": ["mat_exercise_1_parts"],
      "isFreePreview": true,
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T15:00:00Z"
    }
    ```

### 6. Collection `products` (Learning Materials)
*   **Mục đích**: Quản lý metadata của sản phẩm học liệu số.
*   **Đường dẫn**: `/products/{productId}`
*   **Các trường dữ liệu**:
    *   `id` (string): Mã học liệu.
    *   `title` (string): Tên học liệu.
    *   `slug` (string): Slug chuẩn SEO (ví dụ: `file-cad-thiet-ke-vo-hop-nhua`).
    *   `description` (string): Mô tả học liệu.
    *   `price` (number): Giá bán lẻ (0 nếu miễn phí).
    *   `accessType` (string: `'FREE'` | `'PAID'` | `'COURSE_ONLY'`): Kiểu phân quyền truy cập.
    *   `productType` (string: `'CAD'` | `'PDF'` | `'ZIP'` | `'MULTIPLE'`): Loại sản phẩm học liệu.
    *   `specialtyIds` (array of strings): Chuyên ngành liên kết.
    *   `softwareIds` (array of strings): Phần mềm liên kết.
    *   `fileTypes` (array of strings): Định dạng tệp tin hỗ trợ (ví dụ: `['IPT', 'PDF', 'ZIP']`).
    *   `isPublished` (boolean): Trạng thái xuất bản.
    *   `metaTitle` (string): Tiêu đề SEO.
    *   `metaDescription` (string): Mô tả SEO.
    *   `createdAt` (timestamp): Ngày tạo.
    *   `updatedAt` (timestamp): Ngày cập nhật.
*   **Ví dụ document**:
    ```json
    {
      "id": "mat_exercise_1_parts",
      "title": "File CAD bài tập thiết kế vỏ hộp nhựa - Bài 1",
      "slug": "file-cad-thiet-ke-vo-hop-nhua",
      "description": "Chứa các file 3D gốc .ipt và bản vẽ PDF 2D hướng dẫn.",
      "price": 50000,
      "accessType": "PAID",
      "productType": "CAD",
      "specialtyIds": ["spec_mold_design"],
      "softwareIds": ["soft_inventor"],
      "fileTypes": ["IPT", "PDF", "ZIP"],
      "isPublished": true,
      "metaTitle": "Tải file CAD thiết kế vỏ hộp nhựa - Autodesk Inventor",
      "metaDescription": "Bộ file CAD hoàn chỉnh hỗ trợ tách khuôn và mô phỏng CAE.",
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T15:20:00Z"
    }
    ```

### 7. Subcollection `files` (`/products/{productId}/files/{fileId}`)
*   **Mục đích**: Quản lý chi tiết từng tệp tin vật lý đính kèm sản phẩm.
*   **Các trường dữ liệu**:
    *   `id` (string): Mã file.
    *   `productId` (string): ID sản phẩm cha.
    *   `fileName` (string): Tên file hiển thị (ví dụ: `housing_body.ipt`).
    *   `storagePath` (string): Đường dẫn vật lý (`private/products/{productId}/{fileId}/{fileName}`).
    *   `fileType` (string): Định dạng file (`'IPT'` | `'IAM'` | `'PDF'` | `'ZIP'` | `'STEP'` | `'SLDPRT'`).
    *   `fileSize` (number): Kích thước file tính bằng bytes.
    *   `contentType` (string): Định dạng MIME (ví dụ: `application/octet-stream`).
    *   `version` (string): Phiên bản của file (ví dụ: `1.0.0`).
    *   `checksum` (string): Mã băm SHA-256 (ví dụ: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`).
    *   `createdAt` (timestamp): Ngày tạo.
    *   `updatedAt` (timestamp): Ngày cập nhật.
*   **Ví dụ document**:
    ```json
    {
      "id": "file_001",
      "productId": "mat_exercise_1_parts",
      "fileName": "housing_body.ipt",
      "storagePath": "private/products/mat_exercise_1_parts/file_001/housing_body.ipt",
      "fileType": "IPT",
      "fileSize": 2048576,
      "contentType": "application/octet-stream",
      "version": "1.0.0",
      "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "createdAt": "2026-08-27T08:00:00Z",
      "updatedAt": "2026-08-27T15:20:00Z"
    }
    ```

### 8. Collection `orders`
*   **Mục đích**: Quản lý giao dịch và đơn đặt hàng.
*   **Đường dẫn**: `/orders/{orderId}`
*   **Các trường dữ liệu**:
    *   `id` (string): Mã đơn hàng.
    *   `userId` (string): UID người đặt.
    *   `items` (array of maps): Danh sách sản phẩm mua (do Backend tính toán và snapshot):
        *   `targetId` (string)
        *   `targetType` (string: `'course'` | `'product'`)
        *   `snapshotTitle` (string)
        *   `snapshotPrice` (number)
    *   `totalAmount` (number): Tổng số tiền (do Backend tính).
    *   `orderStatus` (string: `'pending'` | `'completed'` | `'cancelled'`): Trạng thái đơn đặt hàng.
    *   `paymentStatus` (string: `'unpaid'` | `'paid'` | `'refunded'`): Trạng thái thanh toán đơn hàng.
    *   `paymentMethod` (string): Phương thức thanh toán.
    *   `createdAt` (timestamp): Ngày tạo đơn hàng.
    *   `updatedAt` (timestamp): Ngày cập nhật đơn hàng.
*   **Ví dụ document**:
    ```json
    {
      "id": "ord_20260827_0001",
      "userId": "usr_90218391283",
      "items": [
        {
          "targetId": "course_inventor_mold_basics",
          "targetType": "course",
          "snapshotTitle": "Thiết kế Khuôn cơ bản trên Autodesk Inventor",
          "snapshotPrice": 250000
        }
      ],
      "totalAmount": 250000,
      "orderStatus": "completed",
      "paymentStatus": "paid",
      "paymentMethod": "Bank Transfer",
      "createdAt": "2026-08-27T15:30:00Z",
      "updatedAt": "2026-08-27T15:35:00Z"
    }
    ```

### 9. Collection `entitlements`
*   **Mục đích**: Quản lý quyền sở hữu nội dung khóa học và sản phẩm học liệu.
*   **Đường dẫn**: `/entitlements/{entitlementId}`
*   **Các trường dữ liệu**:
    *   `id` (string: `{userId}_{targetType}_{targetId}`): Khóa định danh idempotent duy nhất.
    *   `userId` (string): UID người dùng.
    *   `targetId` (string): ID đối tượng được sở hữu.
    *   `targetType` (string: `'product'` | `'course'`): Loại quyền sở hữu.
    *   `type` (string: `'purchase'` | `'admin_grant'` | `'free'`): Hình thức cấp quyền.
    *   `sourceOrderId` (string): Mã đơn đặt hàng liên kết.
    *   `createdAt` (timestamp): Ngày cấp quyền.
    *   `updatedAt` (timestamp): Ngày cập nhật gần nhất.
*   **Ví dụ document**:
    ```json
    {
      "id": "usr_90218391283_course_course_inventor_mold_basics",
      "userId": "usr_90218391283",
      "targetId": "course_inventor_mold_basics",
      "targetType": "course",
      "type": "purchase",
      "sourceOrderId": "ord_20260827_0001",
      "createdAt": "2026-08-27T15:31:00Z",
      "updatedAt": "2026-08-27T15:31:00Z"
    }
    ```

---

## PHẦN 10 — HỆ THỐNG GIAO DIỆN (DESIGN SYSTEM)

MechanicalBKA hướng tới phong cách thiết kế đậm chất kỹ thuật cơ khí, hiện đại, chính xác cao và thân thiện với lập trình viên/kỹ sư.

### 1. Bảng màu chủ đạo (Color Palette)
Hệ thống sử dụng Dark Theme làm mặc định với độ tương phản cao:
*   **Nền (Background)**:
    *   Màu chính: `#0B0F19` (Xanh đen đậm tối giản, tạo cảm giác chuyên nghiệp).
    *   Màu thẻ/bảng điều khiển: `#1E293B` (Xanh xám Slate).
*   **Màu nhấn kỹ thuật (Accents)**:
    *   Màu cam cơ khí (Chính): `#F97316` (Orange 500 - Đại diện cho công nghiệp, năng lượng và nhiệt lượng).
    *   Màu xanh lục CAE (Thành công): `#10B981` (Emerald 500 - Đại diện cho tính ổn định và kết quả mô phỏng tối ưu).
    *   Màu xanh dương CAD (Thông tin): `#3B82F6` (Blue 500 - Đại diện cho độ chính xác của CAD).
*   **Văn bản (Typography Colors)**:
    *   Văn bản chính: `#F8FAFC` (Slate 50) - Trắng sữa dễ đọc trên nền tối.
    *   Văn bản phụ: `#94A3B8` (Slate 400) - Xám nhạt cho thông tin bổ trợ.

### 2. Kiểu chữ (Typography)
*   Font chữ chính: **Outfit** hoặc **Inter** (Google Fonts) - Đem lại cảm giác hình khối hiện đại, hình học kỹ thuật và rất gọn gàng.
*   Font chữ mã nguồn/thông số kỹ thuật: **JetBrains Mono** - Dành riêng cho việc hiển thị thông số file CAD, kích thước và định dạng kỹ thuật.

### 3. Thành phần giao diện (UI Components)
*   **Glassmorphism Effects**: Sử dụng hiệu ứng mờ kính (`backdrop-filter: blur()`) cho Header bar và Sidebar, giúp giao diện có chiều sâu không gian 3D giống như các phần mềm CAD chuyên nghiệp.
*   **Technical Cards (Thẻ thông số)**:
    *   Thẻ khóa học/học liệu hiển thị đầy đủ thông số kỹ thuật ngay bên ngoài: Kích thước file (MB), các phần mềm hỗ trợ (dưới dạng các icon màu nổi bật), độ khó, số lượng bài học.
    *   Hover hiệu ứng: Viền thẻ phát sáng nhẹ (Glow) bằng màu nhấn tương ứng với phần mềm (ví dụ: Viền xanh lá khi di chuột vào tài liệu Inventor).

---

## PHẦN 11 — KIẾN TRÚC CÔNG NGHỆ & THIẾT KẾ PHASES

MechanicalBKA được xây dựng dựa trên nguyên tắc **Public-First** và tích hợp Firebase theo từng giai đoạn (Phase-by-phase). Website có khả năng chạy độc lập hoàn toàn bằng dữ liệu tĩnh (Mock Data) ở các giai đoạn đầu mà không cần kết nối với Firebase Emulator hay hệ thống Firebase thật.

### 1. Mô hình kiến trúc phân lớp phát triển:

```
+---------------------------------------------------------------------------------+
|                                 Frontend Client                                 |
|                  Vite + React.js + Vanilla CSS (CSS Variables)                  |
+---------------------------------------+-----------------------------------------+
                                        |
                 +----------------------+----------------------+
                 | Giai đoạn đầu                               | Giai đoạn tích hợp
                 ▼                                             ▼
     +-----------------------+                    +--------------------------+
     |    Mock Data Layer    |                    |    Firebase Auth SDK     |
     | (Dữ liệu tĩnh cục bộ) |                    | (JWT token verification) |
     +-----------------------+                    +------------+-------------+
                                                               |
                                                               ▼
                                                  +--------------------------+
                                                  | Firebase Cloud Functions |
                                                  |   - Server-side Stream   |
                                                  |   - Local: pipe stream   |
                                                  |   - Prod: Signed URL/pipe|
                                                  +------------+-------------+
                                                               |
                                             +-----------------+-----------------+
                                             ▼                                   ▼
                                  +---------------------+             +--------------------+
                                  |   Cloud Firestore   |             |  Firebase Storage  |
                                  | - Users             |             |  (Private Bucket)  |
                                  | - Entitlements      |             | - File .zip, .ipt  |
                                  | - Courses/Lessons   |             | - File .pdf        |
                                  +---------------------+             +--------------------+
```

### 2. Nguyên tắc tích hợp Firebase từng giai đoạn (Phase-by-Phase Integration)
*   **Không phụ thuộc Emulator khi Deploy sớm:** Bản build Frontend của các Phase đầu tiên sẽ giao tiếp qua một Data Provider trừu tượng. Provider này sẽ trả về dữ liệu mock ở local/staging để chạy độc lập.
*   **Bật/Tắt Firebase động:** Thiết lập biến môi trường `VITE_USE_FIREBASE=true/false` để Frontend chuyển đổi giữa chế độ chạy Mock và chế độ chạy kết nối Firebase thật/Emulator.

---

## PHẦN 12 — LỘ TRÌNH PHÁT TRIỂN (ROADMAP) & TIÊU CHÍ NGHIỆM THU

Dự án được chia làm 12 giai đoạn thực hiện tuần tự để kiểm soát chất lượng kỹ thuật tốt nhất.

### Phase 0 — Thiết lập Đặc tả kỹ thuật (Architecture)
*   **Mục tiêu**: Thống nhất sitemap, cấu trúc database và lộ trình phát triển.
*   **Công việc**: Soạn thảo và chỉnh sửa tài liệu MECHANICALBKA_V1_ARCHITECTURE_FINAL.md trình người dùng.
*   **Điều kiện hoàn thành**: Người dùng duyệt và thông qua tài liệu kiến trúc.

### Phase 1 — Giao diện công cộng độc lập (Public UI)
*   **Mục tiêu**: Đưa website MechanicalBKA lên Internet ở trạng thái công cộng, hoạt động độc lập 100% bằng dữ liệu tĩnh (Mock Data), không phụ thuộc hay kết nối với bất kỳ dịch vụ Firebase nào (Auth, Firestore, Storage, Cloud Functions).
*   **Phạm vi triển khai (Chỉ xây dựng):**
    *   Vite, React, React Router.
    *   Vanilla CSS (CSS Variables cho Design System).
    *   Giao diện tĩnh hiển thị Mock Data của các trang: Home, Specialties, Software, Courses, Course Detail, Store, Product Detail, Videos, Search, Cart, Header, Footer, Navigation.
    *   *Tuyệt đối CHƯA triển khai:* Firebase Auth, Firestore, Firebase Storage, Cloud Functions, Payment, Entitlements, Admin CMS.
*   **Files cần tạo**:
    *   `src/index.css` (Bảng màu nhấn, hiệu ứng Glassmorphism, CSS variables).
    *   `src/components/` (Header, Footer, Navigation, Technical Cards hiển thị CAD/PDF specs).
    *   `src/pages/` (Home, Specialties, Software, Courses, CourseDetail, Store, ProductDetail, Videos, Search, Cart).
*   **Tiêu chí nghiệm thu hoàn thành (Acceptance Criteria):**
    *   Lệnh `npm run dev` chạy khởi động server local không phát sinh lỗi.
    *   Lệnh `npm run build` tạo gói sản xuất (production bundle) thành công không có lỗi build.
    *   Tất cả các public routes chính hoạt động ổn định và chuyển hướng đúng đắn.
    *   Thiết kế thích ứng tốt (Responsive) trên cả Mobile và Desktop.
    *   Không có bất kỳ dependency hay runtime check bắt buộc nào đối với Firebase/Emulator.
    *   Không xuất hiện lỗi đỏ nghiêm trọng (console error) trên trình duyệt.

### Phase 2 — Nội dung công cộng & Mock Data (Public Content)
*   **Mục tiêu**: Đổ dữ liệu mẫu đầy đủ và chuẩn hóa cấu trúc dữ liệu trên Frontend.
*   **Công việc**: Tạo kho Mock Data cục bộ khớp hoàn toàn với Firestore Schema cho các chuyên ngành, phần mềm, khóa học, bài học và sản phẩm học liệu. Tích hợp thanh tìm kiếm và bộ lọc (Filter) động theo Specialty và Software trên UI.
*   **Files cần tạo/sửa**:
    *   `src/mock/data.js` (Mock data cho specialties, software, courses, lessons, products).
    *   `src/pages/Courses.jsx`, `src/pages/Store.jsx` (Sửa để tích hợp bộ lọc và tìm kiếm động).
*   **Test checklist**: Lọc khóa học và học liệu theo chuyên ngành hoặc phần mềm hoạt động chính xác; hiển thị chi tiết bài học và thông tin sản phẩm chuẩn xác từ mock data.

### Phase 3 — Thiết lập Firestore & Cơ sở dữ liệu (Firestore)
*   **Mục tiêu**: Đồng bộ hóa dữ liệu từ Local Mock sang Cloud Firestore.
*   **Công việc**: Cấu hình Firebase config trong ứng dụng, định nghĩa Firestore Security Rules, cài đặt và chạy script Node.js nạp dữ liệu Mock từ Phase 2 lên Firestore.
*   **Files cần tạo/sửa**:
    *   `firestore.rules` (Cấu hình quyền bảo mật Firestore).
    *   `scripts/seedData.js` (Script chạy cục bộ để push mock data lên Firestore).
    *   `src/firebase/config.js` (Khởi tạo Firebase Client SDK).
*   **Test checklist**: Nạp dữ liệu mẫu thành công; Firebase Rules chặn được tất cả các quyền ghi từ người dùng chưa xác thực.

### Phase 4 — Hệ thống Xác thực người dùng (Authentication)
*   **Mục tiêu**: Quản lý tài khoản Student và Admin.
*   **Công việc**: Tích hợp Firebase Auth (Email/Password & Google Sign-In), tạo trang Đăng ký/Đăng nhập, tạo AuthContext quản lý trạng thái đăng nhập, thiết lập Protected Routes bảo vệ trang cá nhân và Admin.
*   **Files cần tạo/sửa**:
    *   `src/context/AuthContext.jsx` (Provider quản lý phiên đăng nhập).
    *   `src/pages/Auth.jsx` (Trang login/register).
    *   `src/components/ProtectedRoute.jsx` (Bọc các route bảo mật).
*   **Test checklist**: Đăng nhập và đăng ký tài khoản thành công; người dùng thông thường không thể truy cập trang Admin `/admin`.

### Phase 5 — Hệ thống học tập & Cửa hàng (Store)
*   **Mục tiêu**: Cho phép xem bài giảng video và quản lý giỏ hàng học liệu.
*   **Công việc**: Nhúng khung phát video YouTube vào trình xem bài học, kết nối hiển thị danh sách sản phẩm trong Store, tạo CartContext để thêm/bớt sản phẩm vào giỏ hàng.
*   **Files cần tạo/sửa**:
    *   `src/pages/LessonViewer.jsx` (Trình phát video bài học).
    *   `src/context/CartContext.jsx` (Quản lý giỏ hàng).
*   **Test checklist**: Video YouTube phát mượt mà; giỏ hàng cập nhật số lượng và tổng tiền chính xác khi thêm/bớt sản phẩm.

### Phase 6 — Đơn hàng & Giao dịch (Orders / Payment)
*   **Mục tiêu**: Xử lý luồng đặt hàng và thanh toán thủ công.
*   **Công việc**: Thiết kế trang Thanh toán giả lập (Checkout) hiển thị thông tin chuyển khoản ngân hàng và QR Code của tác giả, tạo bản ghi đơn hàng `orders` ở trạng thái `pending` trong Firestore khi bấm đặt hàng.
*   **Files cần tạo/sửa**:
    *   `src/pages/Checkout.jsx` (Trang thanh toán chuyển khoản).
*   **Test checklist**: Bấm đặt hàng tạo đúng tài liệu đơn hàng `orders` ở trạng thái `pending`; hiển thị đúng QR thanh toán.

### Phase 7 — Quyền sở hữu nội dung (Entitlement)
*   **Mục tiêu**: Thiết lập quyền truy cập nội dung trả phí cho từng tài khoản.
*   **Công việc**: Cấu hình Firestore Rules cho collection `entitlements` (đảm bảo chỉ có Admin được tạo/sửa và Student chỉ được đọc của chính mình), kết nối UI trang cá nhân (`/account/materials`) hiển thị các khóa học và học liệu đã mua.
*   **Files cần tạo/sửa**:
    *   `src/pages/Account.jsx` (Trang thông tin tài khoản và kho học liệu sở hữu).
*   **Test checklist**: Người dùng đã mua hàng (được Admin cấp entitlement) xem được các khóa học/học liệu trả phí; người dùng chưa mua bị chặn truy cập bài học/file trả phí.

### Phase 8 — Cơ chế Tải file bảo mật (Secure Download)
*   **Mục tiêu**: Viết API bảo vệ tệp tin và thiết lập Firebase Storage.
*   **Công việc**: Phân tách thư mục Firebase Storage thành `/public` và `/private` (bảo vệ bằng Storage Rules). Viết Firebase Cloud Function `/download` để xác thực Auth Token, kiểm tra entitlement, khởi tạo read stream bằng `createReadStream()` từ Storage và `pipe()` nhị phân về Browser (cho Local/Emulator), hoặc tạo Signed URL (cho Production).
*   **Files cần tạo/sửa**:
    *   `storage.rules` (Chặn đọc trực tiếp từ `/private`).
    *   `functions/src/index.ts` (Cloud Function xử lý download streaming/signed URL).
*   **Test checklist**:
    *   Local Emulator: Tải file qua endpoint Function thành công mà không bị lỗi 403 CORS hay lỗi service account.
    *   Truy cập link Storage trực tiếp bị báo lỗi 403.
    *   Tài khoản chưa sở hữu sản phẩm bị báo lỗi 403.

### Phase 9 — Trang CMS Quản trị hệ thống (Admin CMS)
*   **Mục tiêu**: Cung cấp giao diện quản lý nội dung cho tác giả.
*   **Công việc**: Xây dựng trang Admin điều khiển: CRUD Specialties, Software, Courses, Lessons, Products. Giao diện tải file zip/pdf lên Storage, danh sách Đơn hàng (Orders) và nút Duyệt đơn hàng (khi Admin click Duyệt đơn hàng, hệ thống tự động tạo bản ghi `entitlement` tương ứng cho học viên).
*   **Files cần tạo/sửa**:
    *   `src/pages/admin/` (Thư mục chứa các trang quản trị CMS).
*   **Test checklist**: Admin thêm mới khóa học, bài học và tải file zip lên thành công; duyệt đơn hàng và học viên lập tức nhận được quyền học/tải file.

### Phase 10 — Kiểm thử & Tối ưu hóa (Testing)
*   **Mục tiêu**: Đảm bảo hiệu năng và bảo mật hệ thống.
*   **Công việc**: Viết và chạy unit tests cho Cloud Functions, kiểm thử xâm nhập Firestore Security Rules, tối ưu hóa điểm số Core Web Vitals (LCP, INP) trên Frontend.
*   **Test checklist**: Vượt qua toàn bộ checklist bảo mật; trang tải nhanh và mượt mà.

### Phase 11 — Triển khai Sản phẩm (Production)
*   **Mục tiêu**: Đưa MechanicalBKA chính thức lên môi trường Production.
*   **Công việc**: Build bản production của React, deploy lên Firebase Hosting, cập nhật Domain chính thức, chuyển đổi biến cấu hình môi trường sang Production.
*   **Test checklist**: Website chạy ổn định dưới tên miền chính thức; thanh toán và tải file hoạt động tốt với dữ liệu thật.

---

*Tài liệu này được soạn thảo bởi trợ lý AI Antigravity. Vui lòng phản hồi ý kiến đánh giá để bắt đầu giai đoạn tiếp theo.*
