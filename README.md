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

Rate Limiting: max 150 requests/min (429 + yellow toast).

Structured Logging: Pino with X-Request-Id, ignores OPTIONS.

Bulk Import: POST /markers/batch bypasses simulated failures.
