import urllib.request
import json
import ssl
import os
import time

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
    "https://vt.tiktok.com/ZSmYqBh9S/",
    "https://vt.tiktok.com/ZSHKj6q91/",
    "https://vt.tiktok.com/ZSHKjD3KA/",
    "https://vt.tiktok.com/ZSHKjf5Wv/"
]

results = {}

# Ensure the assets folder exists
os.makedirs("assets/thumbnails", exist_ok=True)

for i, u in enumerate(urls):
    local_filename = f"assets/thumbnails/thumb_{i+1}.jpg"
    
    # Check if we already downloaded this thumbnail successfully in a previous run
    if os.path.exists(local_filename) and os.path.getsize(local_filename) > 1000:
        print(f"Skipping {u} (Already downloaded as {local_filename})")
        results[u] = local_filename
        continue

    try:
        print(f"Processing {u} ...")
        # Get real URL
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
        res = urllib.request.urlopen(req, timeout=10)
        real_url = res.url.split('?')[0] # remove query params
        
        # Get oEmbed JSON
        oembed_url = "https://www.tiktok.com/oembed?url=" + real_url
        req2 = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
        res2 = urllib.request.urlopen(req2, timeout=10)
        data = json.loads(res2.read().decode())
        thumb_url = data.get('thumbnail_url', '')
        
        if thumb_url:
            # Download the image
            print(f"  -> Downloading image to {local_filename}")
            
            img_req = urllib.request.Request(thumb_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req, timeout=10) as response, open(local_filename, 'wb') as out_file:
                out_file.write(response.read())
            
            # Map the TikTok URL to the local file path
            results[u] = local_filename
        else:
            print("  -> No thumbnail found.")
            results[u] = ""
            
    except Exception as e:
        print(f"  -> Error: {e}")
        results[u] = str(e)
    
    # Wait 5 seconds to be extra safe with TikTok's rate limiter
    time.sleep(5)

# Save the updated JSON mapping
with open('thumbnails.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\nDone! thumbnails.json has been updated with local file paths.")
