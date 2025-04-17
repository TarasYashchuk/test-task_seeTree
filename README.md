Functionality
Add Marker: click on the map.

Move Marker: press and hold left mouse button, drag, release.

Change Score: click a marker → enter 0–5 or DELETE.

Delete Single: type DELETE in the prompt.

Delete All: “Delete All” button.

Export/Import JSON: export downloads markers.json; import sends bulk POST (/markers/batch).

Notifications (toasts)
Success: green background

Error: red background

Rate Limit (429): yellow background

Highlights
Simulated Failures: every 3rd write request returns HTTP 503.

Rate Limiting: max 50 requests/min (429 + yellow toast).

Bulk Import: POST /markers/batch bypasses simulated failures.

Examples:
Web
![image](https://github.com/user-attachments/assets/9eacb325-be6d-4d8a-b645-1db6a0434b46)

Rate Limiter
p.s kebabs in Turkey
![image](https://github.com/user-attachments/assets/a0869a91-e89c-40f8-9928-b73ac0ccdb62)

Mobile

![image](https://github.com/user-attachments/assets/2a1cf9e3-b393-403a-82a6-c93b04bd2a25)


![image](https://github.com/user-attachments/assets/55cf42d5-da92-4f26-a251-5ceee2e36998)



