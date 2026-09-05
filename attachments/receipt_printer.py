import sys
from pathlib import Path
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

sys.path.append(str(Path(__file__).resolve().parent.parent))

from database.database import get_connection


class ReceiptPrinter:
    """Module xuất phiếu tính phụ cấp ra PDF."""
    
    def __init__(self):
        # Tìm font DejaVu trên Ubuntu
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
            "/usr/share/fonts/TTF/DejaVuSans.ttf",
        ]
        
        self.font_name = 'Helvetica'  # Fallback
        for font_path in font_paths:
            if Path(font_path).exists():
                pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
                self.font_name = 'DejaVuSans'
                break
    
    def print_receipt(self, receipt_id, calc_result, date_str, employee_name, 
                     vehicle_name, start_location, reversed_flags=None):
        """
        Xuất phiếu ra PDF.
        
        Args:
            receipt_id: ID phiếu
            calc_result: Kết quả tính toán
            date_str: Ngày (YYYY-MM-DD)
            employee_name: Tên người vận chuyển
            vehicle_name: Tên phương tiện
            start_location: Điểm bắt đầu
            reversed_flags: List boolean, True nếu tuyến bị đảo chiều
        
        Returns:
            Path tới file PDF
        """
        output_dir = Path("output/receipts")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        if receipt_id:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT receipt_number FROM receipts WHERE id = ?", (receipt_id,))
            receipt = cursor.fetchone()
            conn.close()
            receipt_number = receipt['receipt_number'] if receipt else "TEMP"
        else:
            receipt_number = "TEMP"
        
        pdf_filename = f"Phieu_{receipt_number}.pdf"
        pdf_path = output_dir / pdf_filename
        
        doc = SimpleDocTemplate(str(pdf_path), pagesize=A4,
                               rightMargin=2*cm, leftMargin=2*cm,
                               topMargin=2*cm, bottomMargin=2*cm)
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            alignment=1,
            spaceAfter=20,
            fontName=self.font_name
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            fontName=self.font_name
        )
        
        story = []
        
        story.append(Paragraph("<b>CÔNG TY CỔ PHẦN GIONG VIỆT NAM</b>", normal_style))
        story.append(Paragraph("<i>Hệ thống tính phụ cấp vận chuyển nội bộ</i>", normal_style))
        story.append(Spacer(1, 1*cm))
        
        story.append(Paragraph("<b>PHIẾU TÍNH PHỤ CẤP VẬN CHUYỂN</b>", title_style))
        story.append(Spacer(1, 0.5*cm))
        
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        formatted_date = date_obj.strftime("%d/%m/%Y")
        
        info_data = [
            ["Số phiếu:", receipt_number, "Ngày vận chuyển:", formatted_date],
            ["Người vận chuyển:", employee_name, "Phương tiện:", vehicle_name],
            ["Điểm bắt đầu:", start_location, "", ""]
        ]
        
        info_table = Table(info_data, colWidths=[4*cm, 6*cm, 4*cm, 5*cm])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
        ]))
        story.append(info_table)
        story.append(Spacer(1, 1*cm))
        
        story.append(Paragraph("<b>LỘ TRÌNH CHI TIẾT</b>", normal_style))
        story.append(Spacer(1, 0.3*cm))
        
        route_data = [["STT", "Chặng", "Km"]]
        for i, detail in enumerate(calc_result['route_details']):
            is_reversed = reversed_flags[i] if reversed_flags and i < len(reversed_flags) else detail.get('is_reversed', False)
            
            if is_reversed:
                route_text = f"{detail['from_name']} ← {detail['to_name']}"
            else:
                route_text = f"{detail['from_name']} → {detail['to_name']}"
            
            route_data.append([
                str(i + 1),
                route_text,
                f"{detail['km']:.2f}"
            ])
        
        route_table = Table(route_data, colWidths=[2*cm, 10*cm, 3*cm])
        route_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
        ]))
        story.append(route_table)
        story.append(Spacer(1, 1*cm))
        
        summary_data = [
            ["Tổng quãng đường:", f"{calc_result['total_km']:.2f} km"],
            ["Phí mở chuyến:", f"{calc_result['base_fee']:,} VNĐ"],
            ["Đơn giá:", f"{calc_result['per_km_fee']:,} VNĐ/km"],
            ["Tiền theo km:", f"{int(calc_result['total_km'] * calc_result['per_km_fee']):,} VNĐ"]
        ]
        
        summary_table = Table(summary_data, colWidths=[8*cm, 7*cm])
        summary_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 0.5*cm))
        
        total_style = ParagraphStyle(
            'TotalStyle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.red,
            alignment=2,
            fontName=self.font_name
        )
        story.append(Paragraph(f"<b>TỔNG PHỤ CẤP: {calc_result['total_amount']:,} VNĐ</b>", total_style))
        story.append(Spacer(1, 2*cm))
        
        sig_data = [
            ["Người vận chuyển", "Kế toán", "Người duyệt"],
            ["(Ký, ghi rõ họ tên)", "(Ký)", "(Ký)"],
            ["", "", ""],
            ["", "", ""],
        ]
        
        sig_table = Table(sig_data, colWidths=[5*cm, 5*cm, 5*cm])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ]))
        story.append(sig_table)
        
        doc.build(story)
        
        return str(pdf_path)
