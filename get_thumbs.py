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
    "https://vt.tiktok.com/ZSmYVG9yv/",
    "https://vt.tiktok.com/ZSmYVbfnR/",
    "https://vt.tiktok.com/ZSmYV9oPs/",
    "https://vt.tiktok.com/ZSmYqyRFw/",
    "https://vt.tiktok.com/ZSmYqBkUd/",
    "https://vt.tiktok.com/ZSmYq8Fhv/",
    "https://vt.tiktok.com/ZSmYqBh9S/",
    "https://vt.tiktok.com/ZSHKj6q91/",
    "https://vt.tiktok.com/ZSHKjD3KA/",
    "https://vt.tiktok.com/ZSHKjf5Wv/",
    "https://vt.tiktok.com/ZSx2BBGY1/",
    "https://vt.tiktok.com/ZSx2B2XWW/",
    "https://vt.tiktok.com/ZSxWE7E5y/",  # Added your new link here
    "https://vt.tiktok.com/ZSXDvSJfA/",
    "https://vt.tiktok.com/ZSQJv829J/",
    "https://vt.tiktok.com/ZSQmko8rN/",
    "https://vt.tiktok.com/ZSCks3jRY/",
    "https://vt.tiktok.com/ZSCkGrwpT/"
]

# Try to load existing data to reuse video IDs and avoid hitting TikTok's redirect check repeatedly
existing_data = {}
if os.path.exists('thumbnailsData.js'):
    try:
        with open('thumbnailsData.js', 'r') as f:
            content = f.read().strip()
            # Extract JSON string between `const thumbnailsData = ` and `;`
            if content.startswith('const thumbnailsData ='):
                json_str = content[len('const thumbnailsData ='):].rstrip(';').strip()
                existing_data = json.loads(json_str)
    except Exception as e:
        print(f"Warning: could not parse existing thumbnailsData.js: {e}")

results = {}

# Ensure the assets folder exists
os.makedirs("assets/thumbnails", exist_ok=True)

for u in urls:
    video_short_id = u.strip('/').split('/')[-1]
    local_filename = f"assets/thumbnails/thumb_{video_short_id}.jpg"
    
    # Check if we already have this in existing_data and the format is correct (dict)
    if u in existing_data and isinstance(existing_data[u], dict) and "video_id" in existing_data[u]:
        # If thumbnail exists and is valid, reuse it
        if os.path.exists(local_filename) and os.path.getsize(local_filename) > 1000:
            print(f"Reusing cached details for {u} (video_id: {existing_data[u]['video_id']})")
            results[u] = existing_data[u]
            continue

    try:
        print(f"Processing {u} ...")
        # Get real URL
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
        res = urllib.request.urlopen(req, timeout=10)
        real_url = res.url.split('?')[0] # remove query params
        numeric_video_id = real_url.strip('/').split('/')[-1]
        
        # Check if local image already exists and is valid
        if os.path.exists(local_filename) and os.path.getsize(local_filename) > 1000:
            print(f"  -> Thumbnail already downloaded. Mapping video_id: {numeric_video_id}")
            results[u] = {
                "thumbnail": local_filename,
                "video_id": numeric_video_id
            }
            continue
            
        # Otherwise, fetch oEmbed and download image
        oembed_url = "https://www.tiktok.com/oembed?url=" + real_url
        req2 = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
        res2 = urllib.request.urlopen(req2, timeout=10)
        data = json.loads(res2.read().decode())
        thumb_url = data.get('thumbnail_url', '')
        
        if thumb_url:
            print(f"  -> Downloading image to {local_filename}")
            img_req = urllib.request.Request(thumb_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req, timeout=10) as response, open(local_filename, 'wb') as out_file:
                out_file.write(response.read())
            
            results[u] = {
                "thumbnail": local_filename,
                "video_id": numeric_video_id
            }
        else:
            print("  -> No thumbnail found.")
            results[u] = {
                "thumbnail": "",
                "video_id": numeric_video_id
            }
            
    except Exception as e:
        print(f"  -> Error: {e}")
        # fallback/keep placeholder in case of error
        results[u] = {
            "thumbnail": local_filename if os.path.exists(local_filename) else "",
            "video_id": ""
        }
    
    # Wait 3 seconds to be extra safe with TikTok's rate limiter
    time.sleep(3)

# Save the updated JSON mapping to a JS file to bypass CORS issues on local filesystem
with open('thumbnailsData.js', 'w') as f:
    f.write('const thumbnailsData = ')
    json.dump(results, f, indent=2)
    f.write(';\n')

print("\nDone! thumbnailsData.js has been updated with local file paths and video IDs.")