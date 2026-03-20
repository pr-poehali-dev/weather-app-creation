"""
Получение актуальной погоды и прогноза на 7 дней через OpenWeatherMap API.
Поддерживает поиск по названию города и по координатам (геолокация).
"""

import json
import os
import urllib.request
import urllib.parse


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

BASE_URL = "https://api.openweathermap.org/data/2.5"


def fetch_json(url: str) -> dict:
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"HTTP {e.code}: {body}")


def wind_direction(deg: int) -> str:
    dirs = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"]
    return dirs[round(deg / 45) % 8]


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    api_key = os.environ.get("OPENWEATHER_API_KEY", "")
    if not api_key:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "API ключ не настроен"}),
        }

    params = event.get("queryStringParameters") or {}
    city = params.get("city", "").strip()
    lat = params.get("lat", "").strip()
    lon = params.get("lon", "").strip()
    mode = params.get("mode", "current")  # current | forecast | search

    if mode == "search":
        # Поиск городов по названию
        if not city:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Укажи название города"})}
        q = urllib.parse.urlencode({"q": city, "limit": 8, "appid": api_key})
        data = fetch_json(f"http://api.openweathermap.org/geo/1.0/direct?{q}")
        results = [
            {
                "name": item.get("local_names", {}).get("ru") or item["name"],
                "name_en": item["name"],
                "country": item.get("country", ""),
                "lat": item["lat"],
                "lon": item["lon"],
            }
            for item in data
        ]
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"results": results})}

    # Определяем координаты
    if lat and lon:
        loc_param = urllib.parse.urlencode({"lat": lat, "lon": lon, "appid": api_key, "lang": "ru", "units": "metric"})
    elif city:
        loc_param = urllib.parse.urlencode({"q": city, "appid": api_key, "lang": "ru", "units": "metric"})
    else:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Укажи город или координаты"})}

    if mode == "forecast":
        # Прогноз на 5 дней (каждые 3 часа) — берём по одному значению в день
        raw = fetch_json(f"{BASE_URL}/forecast?{loc_param}&cnt=40")
        city_name = raw["city"].get("name", city)

        # Группируем по датам
        days: dict[str, list] = {}
        for item in raw["list"]:
            date = item["dt_txt"][:10]
            days.setdefault(date, []).append(item)

        forecast = []
        for date, items in list(days.items())[:7]:
            temps = [i["main"]["temp"] for i in items]
            mid = items[len(items) // 2]
            forecast.append({
                "date": date,
                "temp_high": round(max(temps)),
                "temp_low": round(min(temps)),
                "condition": mid["weather"][0]["description"].capitalize(),
                "icon_code": mid["weather"][0]["icon"],
                "rain_prob": round(mid.get("pop", 0) * 100),
                "wind_speed": round(mid["wind"]["speed"] * 3.6),
            })

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"city": city_name, "forecast": forecast}),
        }

    # mode == "current"
    raw = fetch_json(f"{BASE_URL}/weather?{loc_param}")
    result = {
        "city": raw.get("name", city),
        "country": raw["sys"].get("country", ""),
        "temp": round(raw["main"]["temp"]),
        "feels_like": round(raw["main"]["feels_like"]),
        "humidity": raw["main"]["humidity"],
        "pressure": round(raw["main"]["pressure"] * 0.750064),  # hPa → mmHg
        "wind_speed": round(raw["wind"]["speed"] * 3.6),
        "wind_dir": wind_direction(raw["wind"].get("deg", 0)),
        "visibility": round(raw.get("visibility", 10000) / 1000),
        "condition": raw["weather"][0]["description"].capitalize(),
        "icon_code": raw["weather"][0]["icon"],
        "uv": 0,
        "lat": raw["coord"]["lat"],
        "lon": raw["coord"]["lon"],
        "sunrise": raw["sys"]["sunrise"],
        "sunset": raw["sys"]["sunset"],
    }

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps(result),
    }