from datetime import date

from car import calculate_kundli


def test_lagna_uses_coordinates_and_local_timezone() -> None:
    mumbai = calculate_kundli(date(1998, 5, 20), "14:35:00", 19.076, 72.8777, "Asia/Kolkata")
    london = calculate_kundli(date(1998, 5, 20), "14:35:00", 51.5074, -0.1278, "Europe/London")

    assert mumbai["utc"].startswith("1998-05-20T09:05:00")
    assert london["utc"].startswith("1998-05-20T13:35:00")
    assert mumbai["lagna_longitude"] != london["lagna_longitude"]


def test_lagna_changes_with_one_minute() -> None:
    first = calculate_kundli(date(1998, 5, 20), "14:35:00", 19.076, 72.8777, "Asia/Kolkata")
    second = calculate_kundli(date(1998, 5, 20), "14:36:00", 19.076, 72.8777, "Asia/Kolkata")

    assert abs(first["lagna_longitude"] - second["lagna_longitude"]) > 0.05


def test_invalid_coordinates_are_rejected() -> None:
    try:
        calculate_kundli(date(2020, 2, 29), "00:01", 91, 72, "Asia/Kolkata")
    except ValueError as error:
        assert "latitude" in str(error)
    else:
        raise AssertionError("Invalid coordinates must be rejected")
