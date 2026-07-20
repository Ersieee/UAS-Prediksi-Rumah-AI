import urllib.request
import json
req = urllib.request.Request('http://127.0.0.1:5000/predict', data=json.dumps({'luas_tanah': 100}).encode(), headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req, timeout=10) as response:
    print(response.status)
    print(response.read().decode())
