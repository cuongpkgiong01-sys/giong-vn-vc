import sys
from pathlib import Path
from datetime import datetime

sys.path.append(str(Path(__file__).resolve().parent.parent))
from database.database import get_connection

def generate_receipt_number(date_str):
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        dd = dt.strftime("%d")
        mm = dt.strftime("%m")
        yyyy = dt.strftime("%Y")
    except ValueError:
        raise ValueError("Định dạng ngày không hợp lệ. Yêu cầu: YYYY-MM-DD")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM receipts WHERE date = ?", (date_str,))
    count = cursor.fetchone()[0]
    
    stt = count + 1
    conn.close()

    return f"{stt}_{dd}_{mm}_{yyyy}"
