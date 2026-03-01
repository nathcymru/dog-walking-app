import 'package:dog_walking_app/core/config/app_env.dart';
import 'package:dog_walking_app/core/routing/app_router.dart';
import 'package:dog_walking_app/core/services/sync_service.dart';
import 'package:dog_walking_app/core/theme/app_theme.dart';
import 'package:dog_walking_app/shared/platform_helpers.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Validate environment
  try {
    AppEnv.assertValid();
  } catch (e) {
    if (kDebugMode) {
      debugPrint('⚠️  $e');
      debugPrint('Running in dev mode without API_BASE_URL.');
    } else {
      rethrow;
    }
  }

  // Initialize Hive
  await Hive.initFlutter();
  await Future.wait([
    Hive.openBox('gps_session'),
    Hive.openBox('photo_queue'),
    Hive.openBox('walk_cache'),
  ]);

  runApp(const ProviderScope(child: PawWalkersApp()));
}

class PawWalkersApp extends ConsumerStatefulWidget {
  const PawWalkersApp({super.key});

  @override
  ConsumerState<PawWalkersApp> createState() => _PawWalkersAppState();
}

class _PawWalkersAppState extends ConsumerState<PawWalkersApp> {
  @override
  void initState() {
    super.initState();
    // Start SyncService once after the first frame.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(syncServiceProvider).start();
    });
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(appRouterProvider);

    if (isCupertinoPlatform) {
      return CupertinoApp.router(
        title: 'PawWalkers',
        routerConfig: router,
        debugShowCheckedModeBanner: false,
      );
    }

    return MaterialApp.router(
      title: 'PawWalkers',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}

