import 'package:flutter/foundation.dart';

/// Returns `true` when the current platform uses Cupertino styling
/// (iOS or macOS).
bool get isCupertinoPlatform =>
    defaultTargetPlatform == TargetPlatform.iOS ||
    defaultTargetPlatform == TargetPlatform.macOS;
