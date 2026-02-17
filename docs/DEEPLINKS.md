# Deeplink / Push Payload (MVP Stub)

Webview currently exposes a minimal integration point for native wrappers.

## Bridge

Native wrapper can post a message into the webview:

```ts
window.postMessage({
  type: 'deeplink',
  path: '/room/123'
});
```

## Supported payloads

### 1) Explicit path

```json
{ "type": "deeplink", "path": "/room/123" }
```

- `path` must start with `/`.

### 2) Room/message payload

```json
{ "type": "deeplink", "roomId": 123, "messageId": 999 }
```

- Navigates to `/room/123?messageId=999`
- `messageId` is optional.

## Notes

- This is an MVP stub for wrapper integration.
- Authentication guard is still handled by `ProtectedRoute`.
- Push delivery mechanism (FCM/APNs) remains native-side responsibility.
