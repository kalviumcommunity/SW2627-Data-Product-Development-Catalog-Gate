from datetime import datetime, timedelta
from typing import Optional, List, Dict
from fastapi import HTTPException
from app.schemas.current_user import CurrentUser


def jobs_by_status(
    current_user: CurrentUser,
    status: str,
    return_count_only: bool = False
):
    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select("*")
        .eq("status", status)
        .execute()
    )
    
    if return_count_only:
        return len(result.data)
    
    return result.data


def find_active_vendors(
    current_user: CurrentUser,
    return_count_only: bool = False
):
    one_week_ago = datetime.now() - timedelta(days=7)
    
    # Query catalog uploads from the last week
    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select("user_id, users!catalog_uploads_user_id_fkey(*)")
        .gte("created_at", one_week_ago.isoformat())
        .execute()
    )
    
    # Extract unique vendors
    vendors = {}
    for upload in result.data:
        user_id = upload.get("user_id")
        user_data = upload.get("users")
        if user_id and user_data and user_id not in vendors:
            vendors[user_id] = user_data
    
    active_vendors = list(vendors.values())
    
    if return_count_only:
        return len(active_vendors)
    
    return active_vendors


def return_upload_count_daywise_for_last_n_days(
    current_user: CurrentUser,
    n_days: int = 30
) -> List[Dict]:
    n_days_ago = datetime.now() - timedelta(days=n_days)
    
    # Query all catalog uploads from the last n days
    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select("created_at")
        .gte("created_at", n_days_ago.isoformat())
        .execute()
    )
    
    # Group by date and count
    daily_counts = {}
    for upload in result.data:
        created_at = upload.get("created_at")
        if created_at:
            # Parse the date part (YYYY-MM-DD)
            if isinstance(created_at, str):
                date_str = created_at.split("T")[0]
            else:
                date_str = created_at.strftime("%Y-%m-%d")
            
            daily_counts[date_str] = daily_counts.get(date_str, 0) + 1
    
    # Generate all dates in the range and fill missing days with 0
    result_list = []
    for i in range(n_days):
        current_date = datetime.now() - timedelta(days=n_days - 1 - i)
        date_str = current_date.strftime("%Y-%m-%d")
        result_list.append({
            "date": date_str,
            "count": daily_counts.get(date_str, 0)
        })
    
    return result_list


def return_health(current_user: CurrentUser) -> Dict:
    # Query all catalog uploads with their status
    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select("status")
        .execute()
    )
    
    # Count statuses
    status_counts = {}
    for upload in result.data:
        status = upload.get("status", "UNKNOWN")
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # Map statuses to categories
    success_statuses = ["COMPLETED", "SUCCESS"]
    failure_statuses = ["FAILED", "ERROR", "REJECTED"]
    
    success_count = sum(status_counts.get(status, 0) for status in success_statuses)
    failure_count = sum(status_counts.get(status, 0) for status in failure_statuses)
    
    total_count = success_count + failure_count
    
    if total_count == 0:
        return {
            "health_percentage": 100.0,  # Default to 100% if no data
            "success_count": 0,
            "failure_count": 0,
            "total_count": 0
        }
    
    # Calculate health percentage
    health_score = (success_count * 100) + (failure_count * 0)
    health_percentage = (health_score / total_count)
    
    return {
        "health_percentage": round(health_percentage, 1),
        "success_count": success_count,
        "failure_count": failure_count,
        "total_count": total_count
    }
