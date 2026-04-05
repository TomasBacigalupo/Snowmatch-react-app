# Universal Links / App Links (snowmatch.pro)

These files must be served at **https://snowmatch.pro/.well-known/** (same host users open in the browser).

## Before production

1. **apple-app-site-association**  
   Replace `APPLE_TEAM_ID` with your 10-character Apple Developer Team ID (Membership page).  
   `appID` must be `{TeamID}.pro.snowmatch`.

2. **assetlinks.json**  
   Replace `REPLACE_WITH_RELEASE_SHA256_FINGERPRINT` with your **release** signing certificate SHA-256 (from Play Console or `keytool -list -v -keystore …`).  
   Use the colon-separated hex format if your tooling outputs it that way.

3. **S3 / CloudFront**  
   Serve `apple-app-site-association` with `Content-Type: application/json` (recommended).  
   No file extension on the Apple file — keep the filename exactly `apple-app-site-association`.

4. **Deploy**  
   If the marketing site for `snowmatch.pro` is not built from this repo’s `public/` folder, copy these two files to whatever hosts that domain.

After changing Team ID or fingerprints, rebuild the iOS/Android app (EAS) so entitlements and intent filters match.
