// この CSP は、CloudFront の応答ヘッダーと web のブラウザテストの両方で使う
// ビルドした index.html にはインラインのスクリプトとスタイルがないので、CSP は 'self' だけで足りる
export const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');
