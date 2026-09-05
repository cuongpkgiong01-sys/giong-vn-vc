import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from database.database import get_connection

def calculate_allowance(vehicle_id, route_ids, reversed_flags=None):
    """
    Tính toán phụ cấp vận chuyển.
    
    Args:
        vehicle_id: ID phương tiện
        route_ids: Danh sách route IDs
        reversed_flags: List boolean, True nếu tuyến bị đảo chiều
    
    Returns:
        Dict chứa kết quả tính toán
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name, base_fee, per_km_fee FROM vehicles WHERE id = ?", (vehicle_id,))
    vehicle = cursor.fetchone()
    if not vehicle:
        conn.close()
        raise ValueError(f"Không tìm thấy phương tiện với ID: {vehicle_id}")
    
    vehicle_name = vehicle['name']
    base_fee = vehicle['base_fee']
    per_km_fee = vehicle['per_km_fee']

    route_details = []
    total_km = 0.0
    
    placeholders = ','.join('?' * len(route_ids))
    query = f'''
        SELECT r.id, l1.name as from_name, l2.name as to_name, r.distance_km
        FROM routes r
        JOIN locations l1 ON r.from_location_id = l1.id
        JOIN locations l2 ON r.to_location_id = l2.id
        WHERE r.id IN ({placeholders})
    '''
    cursor.execute(query, route_ids)
    routes = cursor.fetchall()

    route_dict = {row['id']: row for row in routes}
    for i, r_id in enumerate(route_ids):
        if r_id not in route_dict:
            conn.close()
            raise ValueError(f"Không tìm thấy tuyến đường với ID: {r_id}")
        row = route_dict[r_id]
        
        is_reversed = reversed_flags[i] if reversed_flags and i < len(reversed_flags) else False
        
        route_details.append({
            "route_id": row['id'],
            "from_name": row['from_name'],
            "to_name": row['to_name'],
            "km": row['distance_km'],
            "is_reversed": is_reversed
        })
        total_km += row['distance_km']

    total_amount = round(base_fee + (total_km * per_km_fee))

    conn.close()

    return {
        "vehicle_name": vehicle_name,
        "base_fee": base_fee,
        "per_km_fee": per_km_fee,
        "route_details": route_details,
        "total_km": round(total_km, 2),
        "total_amount": total_amount
    }
