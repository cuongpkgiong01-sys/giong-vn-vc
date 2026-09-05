import sys
import shutil
import exifread
from pathlib import Path
from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

sys.path.append(str(Path(__file__).resolve().parent.parent))
from database.database import get_connection, get_images_dir


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Tính khoảng cách giữa 2 điểm GPS trên bề mặt Trái Đất (công thức Haversine).
    Input: Vĩ độ, kinh độ dạng số thập phân (decimal degrees).
    Output: Khoảng cách tính bằng mét.
    """
    R = 6371000  # Bán kính Trái Đất (mét)
    φ1, φ2 = radians(lat1), radians(lat2)
    Δφ = radians(lat2 - lat1)
    Δλ = radians(lon2 - lon1)
    
    a = sin(Δφ/2)**2 + cos(φ1) * cos(φ2) * sin(Δλ/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    
    return R * c


def _convert_gps_to_decimal(gps_coords, gps_ref):
    """
    Chuyển đổi GPS từ dạng DMS (Độ/Phút/Giây) sang số thập phân.
    Input: 
        gps_coords: List 3 giá trị [degrees, minutes, seconds]
        gps_ref: 'N', 'S', 'E', 'W'
    Output: Số thập phân (float)
    """
    degrees = float(gps_coords[0].num) / float(gps_coords[0].den)
    minutes = float(gps_coords[1].num) / float(gps_coords[1].den)
    seconds = float(gps_coords[2].num) / float(gps_coords[2].den)
    
    decimal = degrees + minutes / 60 + seconds / 3600
    
    if gps_ref in ['S', 'W']:
        decimal = -decimal
    
    return decimal


def read_gps_from_image(image_path):
    """
    Đọc tọa độ GPS từ file ảnh.
    Input: Đường dẫn tuyệt đối tới file ảnh.
    Output: Tuple (latitude, longitude) hoặc None nếu không có GPS.
    """
    try:
        with open(image_path, 'rb') as f:
            tags = exifread.process_file(f, details=False)
        
        # Kiểm tra có tag GPS không
        if 'GPS GPSLatitude' not in tags or 'GPS GPSLongitude' not in tags:
            return None
        
        lat_coords = tags['GPS GPSLatitude'].values
        lat_ref = tags['GPS GPSLatitudeRef'].values
        
        lon_coords = tags['GPS GPSLongitude'].values
        lon_ref = tags['GPS GPSLongitudeRef'].values
        
        lat = _convert_gps_to_decimal(lat_coords, lat_ref)
        lon = _convert_gps_to_decimal(lon_coords, lon_ref)
        
        return (lat, lon)
    
    except Exception as e:
        print(f"Lỗi khi đọc GPS từ ảnh {image_path}: {e}")
        return None


def get_route_location_ids(route_ids):
    """
    Lấy danh sách location_id (from và to) từ danh sách route_ids.
    Output: List các location_id duy nhất.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    placeholders = ','.join('?' * len(route_ids))
    query = f'''
        SELECT DISTINCT from_location_id, to_location_id
        FROM routes
        WHERE id IN ({placeholders})
    '''
    cursor.execute(query, route_ids)
    rows = cursor.fetchall()
    
    location_ids = set()
    for row in rows:
        location_ids.add(row['from_location_id'])
        location_ids.add(row['to_location_id'])
    
    conn.close()
    return list(location_ids)


def get_locations_by_ids(location_ids):
    """
    Lấy thông tin các điểm từ danh sách location_id.
    Output: Dict {location_id: {'name': ..., 'latitude': ..., 'longitude': ...}}
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    placeholders = ','.join('?' * len(location_ids))
    query = f'''
        SELECT id, name, latitude, longitude
        FROM locations
        WHERE id IN ({placeholders})
    '''
    cursor.execute(query, location_ids)
    rows = cursor.fetchall()
    
    locations = {}
    for row in rows:
        locations[row['id']] = {
            'name': row['name'],
            'latitude': row['latitude'],
            'longitude': row['longitude']
        }
    
    conn.close()
    return locations


def match_gps_to_route(exif_lat, exif_lon, route_location_ids, tolerance_m=500):
    """
    Đối chiếu tọa độ GPS với các điểm trong lộ trình.
    Input:
        exif_lat, exif_lon: Tọa độ GPS từ ảnh
        route_location_ids: Danh sách location_id trong lộ trình
        tolerance_m: Bán kính dung sai (mét), mặc định 500m
    Output: Dict chứa kết quả đối chiếu
    """
    locations = get_locations_by_ids(route_location_ids)
    
    min_distance = float('inf')
    matched_location_id = None
    matched_location_name = None
    
    for loc_id, loc_info in locations.items():
        distance = haversine_distance(
            exif_lat, exif_lon,
            loc_info['latitude'], loc_info['longitude']
        )
        
        if distance < min_distance:
            min_distance = distance
            matched_location_id = loc_id
            matched_location_name = loc_info['name']
    
    if min_distance <= tolerance_m:
        return {
            'match_status': 'Matched',
            'matched_location_id': matched_location_id,
            'matched_location': matched_location_name,
            'distance_to_matched': round(min_distance, 2),
            'warning': None
        }
    else:
        return {
            'match_status': 'Unmatched',
            'matched_location_id': None,
            'matched_location': matched_location_name,
            'distance_to_matched': round(min_distance, 2),
            'warning': f'Ảnh cách điểm gần nhất ({matched_location_name}) {min_distance:.0f}m, vượt quá bán kính {tolerance_m}m'
        }


def copy_image_to_storage(source_path, receipt_id):
    """
    Copy ảnh vào thư mục lưu trữ theo cấu trúc YYYY/MM/DD/{receipt_id}_{timestamp}.jpg
    Input:
        source_path: Đường dẫn ảnh gốc
        receipt_id: ID phiếu (dùng để đặt tên file)
    Output: Đường dẫn tuyệt đối của ảnh đã copy
    """
    source = Path(source_path)
    if not source.exists():
        raise FileNotFoundError(f"File ảnh không tồn tại: {source_path}")
    
    now = datetime.now()
    year = now.strftime("%Y")
    month = now.strftime("%m")
    day = now.strftime("%d")
    timestamp = now.strftime("%H%M%S")
    
    images_dir = Path(get_images_dir())
    target_dir = images_dir / year / month / day
    target_dir.mkdir(parents=True, exist_ok=True)
    
    target_filename = f"{receipt_id}_{timestamp}{source.suffix}"
    target_path = target_dir / target_filename
    
    shutil.copy2(source, target_path)
    
    return str(target_path)


def process_evidence(image_path, route_ids, receipt_id):
    """
    Hàm tổng hợp xử lý 1 ảnh chứng cứ.
    Input:
        image_path: Đường dẫn ảnh gốc
        route_ids: Danh sách route_id của phiếu
        receipt_id: ID phiếu (hoặc chuỗi tạm để đặt tên file)
    Output: Dict chứa toàn bộ thông tin xử lý
    """
    result = {
        'image_path': None,
        'has_gps': False,
        'exif_lat': None,
        'exif_lon': None,
        'match_status': 'Pending',
        'matched_location_id': None,
        # Chưa đối chiếu GPS nên chưa có địa điểm khớp.  Khởi tạo None để
        # ảnh không bị lỗi NameError trước khi tới bước đối chiếu.
        'matched_location': None,
        'distance_to_matched': None,
        'warning': None
    }
    
    # 1. Copy ảnh vào thư mục lưu trữ
    try:
        stored_path = copy_image_to_storage(image_path, receipt_id)
        result['image_path'] = stored_path
    except Exception as e:
        result['warning'] = f"Lỗi khi copy ảnh: {e}"
        return result
    
    # 2. Đọc GPS từ ảnh
    gps_coords = read_gps_from_image(stored_path)
    
    if gps_coords is None:
        result['has_gps'] = False
        result['match_status'] = 'No_GPS'
        result['warning'] = 'Ảnh không chứa dữ liệu GPS'
        return result
    
    result['has_gps'] = True
    result['exif_lat'] = gps_coords[0]
    result['exif_lon'] = gps_coords[1]
    
    # 3. Lấy danh sách location_id từ route_ids
    route_location_ids = get_route_location_ids(route_ids)
    
    if not route_location_ids:
        result['match_status'] = 'Unmatched'
        result['warning'] = 'Không có điểm nào trong lộ trình để đối chiếu'
        return result
    
    # 4. Đối chiếu GPS với các điểm trong lộ trình
    match_result = match_gps_to_route(
        gps_coords[0], gps_coords[1],
        route_location_ids,
        tolerance_m=500
    )
    
    result['match_status'] = match_result['match_status']
    result['matched_location_id'] = match_result['matched_location_id']
    result['matched_location'] = match_result['matched_location']
    result['distance_to_matched'] = match_result['distance_to_matched']
    result['warning'] = match_result['warning']
    
    return result


if __name__ == "__main__":
    # Test nhanh hàm haversine
    # Khoảng cách từ VP (Ngọc Lâm) đến Từ Sơn
    lat1, lon1 = 21.0474332764, 105.8779599168
    lat2, lon2 = 21.1097603705, 105.9593490757
    distance = haversine_distance(lat1, lon1, lat2, lon2)
    print(f"Khoảng cách chim bay VP -> Từ Sơn: {distance:.0f}m ({distance/1000:.2f}km)")
