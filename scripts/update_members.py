import json
import re
from pathlib import Path

BASE = Path("data/members.json")
PHOTO_ROOT = Path("\u6703\u54e1\u7167\u7247")
VALID_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
EXCLUDE_KEYWORDS = ["\u7e2e\u5716", "thumb"]
ALIASES = {
    "\u5f90\u91c7\u7487": ["\u5f90\u5e7c\u7487"],
}


def load_photo_files():
    files = []
    for path in PHOTO_ROOT.rglob("*"):
        if path.suffix.lower() not in VALID_EXTS:
            continue
        stem_lower = path.stem.lower()
        if any(keyword in path.stem for keyword in EXCLUDE_KEYWORDS) or any(
            keyword in stem_lower for keyword in EXCLUDE_KEYWORDS
        ):
            continue
        files.append(path)
    return files


PHOTO_FILES = load_photo_files()


def score(path: Path):
    stem = path.stem
    value = 0
    if "\u53bb\u80cc" in stem:
        value -= 5
    if "\u6b63\u65b9" in stem or "\u5f62\u8c61\u7167" in stem:
        value -= 4
    if "\u6a6b\u5f0f" in stem:
        value += 1
    if path.suffix.lower() == ".png":
        value -= 1
    return (value, len(stem))


def find_photo(member_name: str):
    if not member_name:
        return None
    keywords = [member_name]
    keywords.extend(ALIASES.get(member_name, []))
    candidates = [
        p
        for p in PHOTO_FILES
        if any(keyword in p.stem or keyword in p.as_posix() for keyword in keywords)
    ]
    if not candidates:
        return None
    candidates.sort(key=score)
    return candidates[0]


def derive_services(description: str, fallback: str):
    if not description:
        return [fallback] if fallback else []
    cleaned = description.replace("\uFF1B", "\uFF0C")
    segments = re.split("[\uFF0C\u3002]", cleaned)
    services = []
    for segment in segments:
        segment = segment.strip()
        if not segment:
            continue
        if segment not in services:
            services.append(segment)
        if len(services) >= 4:
            break
    if not services and fallback:
        services.append(fallback)
    return services


def derive_hashtags(industry: str, services):
    hashtags = []
    if industry:
        sanitized_industry = "#" + re.sub(r"[\s\u3001\uFF0C,/]+", "", industry)
        hashtags.append(sanitized_industry)
    if services:
        sanitized_service = "#" + re.sub(r"[\s\u3001\uFF0C,/]+", "", services[0])[:12]
        if len(sanitized_service) > 1:
            hashtags.append(sanitized_service)
    hashtags.extend(["#BNI\u9577\u8f1d\u767d\u91d1", "#\u5c08\u696d\u5f15\u85a6"])
    deduped = []
    seen = set()
    for tag in hashtags:
        tag = tag.replace("##", "#").strip()
        if not tag or tag in seen:
            continue
        seen.add(tag)
        deduped.append(tag)
        if len(deduped) >= 5:
            break
    return deduped


def main():
    if not BASE.exists():
        raise SystemExit("members.json not found")

    data = json.loads(BASE.read_text(encoding="utf-8"))
    members = data.get("members", [])
    refreshed_members = []
    manifests = []
    skipped = []

    for member in members:
        name = member.get("name")
        photo = find_photo(name)
        if not photo:
            skipped.append(name)
            continue

        rel_path = photo.as_posix()
        if rel_path.startswith("./"):
            rel_path = rel_path[2:]
        member["photo"] = rel_path

        services = derive_services(member.get("description", ""), member.get("industry", ""))
        member["services"] = services
        member["hashtags"] = derive_hashtags(member.get("industry", ""), services)

        website = member.pop("website", None)
        social = {}
        if website:
            social["website"] = website
        contact = member.get("contact") or {}
        member["social"] = social

        manifests.append({"name": name, "photo": rel_path})
        refreshed_members.append(member)

    refreshed_members.sort(key=lambda m: m.get("name", ""))
    data["members"] = refreshed_members

    BASE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    Path("data/photo-manifest.json").write_text(
        json.dumps({"members": manifests, "skipped": skipped}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
