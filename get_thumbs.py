import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

urls = [
    "https://vt.tiktok.com/ZSmYVKx3j/",
    "https://vt.tiktok.com/ZSmYqJ3sB/",
    "https://vt.tiktok.com/ZSmYVP952/",
    "https://vt.tiktok.com/ZSmYVarXw/",
    "https://vt.tiktok.com/ZSmYVG9yv/",
    "https://vt.tiktok.com/ZSmYVbfnR/",
    "https://vt.tiktok.com/ZSmYV9oPs/",
    "https://vt.tiktok.com/ZSmYqyRFw/",
    "https://vt.tiktok.com/ZSmYqBkUd/",
    "https://vt.tiktok.com/ZSmYVopMf/",
    "https://vt.tiktok.com/ZSmYq8Fhv/",
    "https://vt.tiktok.com/ZSmYqBh9S/"
]

results = {}

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
        res = urllib.request.urlopen(req, timeout=10)
        real_url = res.url.split('?')[0] # remove query params
        
        oembed_url = "https://www.tiktok.com/oembed?url=" + real_url
        req2 = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
        res2 = urllib.request.urlopen(req2, timeout=10)
        data = json.loads(res2.read().decode())
        results[u] = data.get('thumbnail_url', '')
    except Exception as e:
        results[u] = str(e)

with open('thumbnails.json', 'w') as f:
    json.dump(results, f, indent=2)
