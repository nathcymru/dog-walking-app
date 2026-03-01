# PawWalkers — Flutter App

A full Flutter rewrite of the PawWalkers dog walking app, targeting iOS and Android (web optional). Communicates exclusively with the Cloudflare Workers HTTPS API.

## Prerequisites

- **Flutter stable** channel (≥ 3.22, Dart ≥ 3.4)
- Xcode ≥ 15 (iOS builds)
- Android Studio / Android SDK (Android builds)

Check your Flutter installation:
```bash
flutter doctor
```

## Setup

### 1. Install dependencies

```bash
cd flutter
flutter pub get
```

### 2. Run code generation

The project uses `json_serializable` for DTO code generation. Run:

```bash
dart run build_runner build --delete-conflicting-outputs
```

This generates `.g.dart` files for all DTOs annotated with `@JsonSerializable()`.

To watch for changes during development:
```bash
dart run build_runner watch --delete-conflicting-outputs
```

## Running the App

You **must** provide `API_BASE_URL` via `--dart-define`. Without it the app will throw a `StateError` in release mode (or print a warning in debug mode).

### Development
```bash
flutter run \
  --dart-define=API_BASE_URL=https://your-worker.workers.dev \
  --dart-define=APP_ENV=dev \
  --dart-define=ENABLE_NETWORK_LOGS=true
```

### Production
```bash
flutter run --release \
  --dart-define=API_BASE_URL=https://your-worker.workers.dev \
  --dart-define=APP_ENV=prod
```

## Building

### Android APK
```bash
flutter build apk --release \
  --dart-define=API_BASE_URL=https://your-worker.workers.dev \
  --dart-define=APP_ENV=prod
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (Play Store)
```bash
flutter build appbundle --release \
  --dart-define=API_BASE_URL=https://your-worker.workers.dev \
  --dart-define=APP_ENV=prod
```

### iOS
```bash
flutter build ios --release \
  --dart-define=API_BASE_URL=https://your-worker.workers.dev \
  --dart-define=APP_ENV=prod
```

Then open `ios/Runner.xcworkspace` in Xcode to archive and distribute.

## iOS Setup Notes

1. Open `ios/Runner.xcworkspace` in Xcode.
2. Set your Team and Bundle Identifier in **Signing & Capabilities**.
3. The following permissions are already declared in `Info.plist`:
   - `NSLocationWhenInUseUsageDescription` — GPS walk tracking
   - `NSLocationAlwaysAndWhenInUseUsageDescription` — GPS walk tracking
   - `NSCameraUsageDescription` — Walk photo capture
   - `NSPhotoLibraryUsageDescription` — Walk photo attachment
4. For `geolocator`, ensure **Location** capability is enabled in Xcode.

## Android Setup Notes

1. The following permissions are declared in `AndroidManifest.xml`:
   - `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` — GPS tracking
   - `INTERNET` — API communication
   - `CAMERA`, `READ_EXTERNAL_STORAGE` — Photo capture
2. Minimum SDK: 21 (Android 5.0). Update `android/app/build.gradle` if needed.
3. For `flutter_secure_storage` on Android < 6.0: the library falls back to AES encryption.

## Flutter Web (optional)

For web support, `flutter_secure_storage` requires the web variant. Add to `pubspec.yaml`:

```yaml
dependencies:
  flutter_secure_storage_web: ^1.0.0
```

And initialize with web options:
```dart
const storage = FlutterSecureStorage(
  webOptions: WebOptions(dbName: 'pawwalkers', publicKey: 'pawwalkers_key'),
);
```

## Running Tests

```bash
flutter test
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | **Yes** | Base URL of the Cloudflare Workers API, e.g. `https://api.example.com` |
| `APP_ENV` | No (default: `dev`) | Environment name: `dev` or `prod` |
| `ENABLE_NETWORK_LOGS` | No (default: `false`) | Enable verbose network logging (dev only, secrets redacted) |

## Architecture

- **Routing**: `go_router` with auth guard redirects
- **State**: Riverpod (`AsyncNotifier`, `Provider`)
- **Networking**: Dio with interceptors (auth, retry, refresh, request-id, logging)
- **Token storage**: `flutter_secure_storage` only
- **Offline cache**: Hive (GPS points, photo queue, walk cache)
- **GPS**: `geolocator` (foreground, high accuracy, 10m filter, 5s interval, 50m accuracy gate)
- **Photos**: `image_picker` → `flutter_image_compress` → presigned R2 PUT → confirm
- **Sync**: `connectivity_plus` monitors online state, retries failed uploads with exponential backoff
