import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/quy-che")({ component: PolicyPage });

function PolicyPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cộng hòa xã hội chủ nghĩa Việt Nam
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Độc lập — Tự do — Hạnh phúc</p>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Quy chế phụ cấp vận chuyển nội bộ</h1>
        <p className="mt-2 text-sm text-muted-foreground">Công ty cổ phần Giong Việt Nam · Số …/QC-GIONG</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Công thức</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p className="rounded-md bg-muted px-4 py-3 font-medium">
            Tổng phụ cấp 1 chuyến = Phí mở chuyến (chỉ 1 lần) + (Tổng km thực tế × Đơn giá/km)
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Xe máy: phí mở 10.000 đ + 5.000 đ/km (cụm Mê Linh, Thanh Oai) và + 4.000 đ/km (cụm Từ Sơn)</li>
            <li>Ô tô: phí mở 20.000 đ + 8.000 đ/km</li>
            <li>Km lấy theo đường bộ Google Maps / GPS, không tính chim bay</li>
            <li>Chỉ tính 1 chiều (không tính chiều về)</li>
            <li>Đi nhiều điểm: phí mở vẫn chỉ 1 lần</li>
          </ul>
        </CardContent>
      </Card>

      <Article n="1" title="Phạm vi và đối tượng">
        Quy chế quy định chế độ phụ cấp vận chuyển nội bộ, phương pháp tính định mức và kiểm soát tại Công ty.
        Áp dụng cho người lao động vận chuyển vật tư giữa các địa điểm, người điều khiển xe máy / ô tô theo lệnh
        điều xe, và các phòng Hành chính, Kế toán, Kiểm soát nội bộ, Bảo vệ, Ban Giám đốc.
      </Article>

      <Article n="2" title="Mục đích và nguyên tắc">
        Tuân thủ định mức, tối ưu thuế TNDN, ngăn thất thoát, nâng hiệu suất vận tải. Tính toán dựa trên dữ liệu
        thực tế (GPS / Google Maps), công bằng, minh bạch, có chứng từ đầy đủ.
      </Article>

      <Article n="3" title="Hình thức khoán">
        Khoán theo chuyến (mỗi lần lấy/giao hàng) cho xe máy và ô tô. Áp dụng mọi tuyến giữa các điểm trong danh
        sách — không bắt buộc đi qua trung tâm cụm. Điểm Long Biên, Ngọc Lâm, Sài Đồng gần văn phòng không khoán riêng.
      </Article>

      <Article n="4" title="Hàng hóa và phụ phí">
        Hàng hóa: vật tư tiêu hao ngành y tế tiêm chủng mở rộng (bông, băng gạc, cốc giấy, giấy vệ sinh, bơm tiêm,
        mũi tiêm…). Phụ phí: ban đêm / ngoài giờ hành chính +15%; lễ, Tết +20%.
      </Article>

      <Article n="5" title="Quy trình kiểm soát">
        Tiếp nhận và phân loại → kiểm tra chứng từ → kiểm soát niêm phong và camera AI (nếu có) → ghi nhận hệ thống
        → kiểm soát an ninh lần cuối và kiểm tra ngẫu nhiên. Chứng từ tối thiểu: lệnh điều xe, phiếu xuất kho nội bộ,
        xác nhận nhận hàng của trung tâm.
      </Article>

      <Article n="6" title="Trách nhiệm">
        Hành chính lập và cập nhật định mức; Kế toán kiểm tra chứng từ và hạch toán; Kiểm soát nội bộ và Bảo vệ thực
        hiện quy trình; người nhận khoán khai báo trung thực; Ban Giám đốc phê duyệt định mức.
      </Article>

      <Card>
        <CardHeader>
          <CardTitle>Ưu tiên phương tiện</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Đơn nhỏ, gấp, 1–2 điểm → xe máy. Đơn lớn, nhiều thùng, nhiều điểm → ô tô. Mọi trường hợp ngoài bảng định
          mức phải được Hành chính xác nhận và trình cấp có thẩm quyền trước khi thực hiện.
        </CardContent>
      </Card>
    </div>
  );
}

function Article({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
        Điều {n}. {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}