#!/usr/bin/env python3
"""
批量為所有會員添加社交連結預留位
除了李孟一已有真實資料外，其他會員都添加空白預留位
"""

import json

# 讀取會員資料
with open('data/members-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 為每位會員添加社交連結預留位
for member in data['members']:
    # 李孟一已經有真實資料，跳過
    if member['name'] == '李孟一':
        continue
    
    # 如果links為空，添加兩個預留位
    if not member.get('links') or len(member['links']) == 0:
        member['links'] = [
            {
                "type": "website",
                "url": "",
                "icon": "website"
            },
            {
                "type": "facebook",
                "url": "",
                "icon": "facebook"
            }
        ]

# 儲存更新後的資料
with open('data/members-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ 已為 {len(data['members'])} 位會員添加社交連結預留位")
print("📝 李孟一的真實資料已保留")
