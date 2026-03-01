import 'package:dog_walking_app/features/auth/domain/user_entity.dart';
import 'package:dog_walking_app/features/auth/presentation/auth_controller.dart';
import 'package:dog_walking_app/features/auth/presentation/login_screen.dart';
import 'package:dog_walking_app/features/dashboard/presentation/dashboard_screen.dart';
import 'package:dog_walking_app/features/profile/presentation/profile_screen.dart';
import 'package:dog_walking_app/features/walks/presentation/active_walk_screen.dart';
import 'package:dog_walking_app/features/walks/presentation/walk_detail_screen.dart';
import 'package:dog_walking_app/features/walks/presentation/walk_list_screen.dart';
import 'package:dog_walking_app/shared/platform_helpers.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final notifier = _RouterNotifier(ref);
  final router = GoRouter(
    initialLocation: '/login',
    refreshListenable: notifier,
    redirect: notifier.redirect,
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/walks',
        builder: (context, state) => const WalkListScreen(),
      ),
      GoRoute(
        path: '/walks/active',
        builder: (context, state) => const ActiveWalkScreen(),
      ),
      GoRoute(
        path: '/walk/:id',
        builder: (context, state) => WalkDetailScreen(
          walkId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/bookings',
        builder: (context, state) =>
            const _PlaceholderScreen(title: 'Bookings'),
      ),
    ],
  );
  ref.onDispose(router.dispose);
  ref.onDispose(notifier.dispose);
  return router;
});

/// Bridges Riverpod auth state to go_router's [Listenable] interface so that
/// route redirects are re-evaluated whenever the auth state changes.
class _RouterNotifier extends ChangeNotifier {
  _RouterNotifier(this._ref) {
    // Listen to auth state changes and trigger re-evaluation of redirects.
    _ref.listen<AsyncValue<UserEntity?>>(
      authControllerProvider,
      (_, __) => notifyListeners(),
    );
  }

  final Ref _ref;

  String? redirect(BuildContext context, GoRouterState state) {
    final authState = _ref.read(authControllerProvider);
    // Don't redirect while loading
    if (authState.isLoading) return null;

    final user = authState.valueOrNull;
    final isLoggingIn = state.matchedLocation == '/login';

    if (user == null && !isLoggingIn) {
      return '/login';
    }
    if (user != null && isLoggingIn) {
      return '/dashboard';
    }
    return null;
  }
}

class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    if (isCupertinoPlatform) {
      return CupertinoPageScaffold(
        navigationBar: CupertinoNavigationBar(middle: Text(title)),
        child: Center(child: Text('$title — coming soon')),
      );
    }
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text('$title — coming soon')),
    );
  }
}
