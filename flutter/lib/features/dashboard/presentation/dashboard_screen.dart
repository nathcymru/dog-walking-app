import 'package:dog_walking_app/features/auth/presentation/auth_controller.dart';
import 'package:dog_walking_app/features/dashboard/presentation/dashboard_controller.dart';
import 'package:dog_walking_app/shared/platform_helpers.dart';
import 'package:dog_walking_app/shared/widgets/error_view.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).valueOrNull;
    final statsState = ref.watch(dashboardControllerProvider);
    final isAdmin = user?.role == 'admin';

    if (isCupertinoPlatform) {
      return _buildCupertino(context, ref, statsState, user, isAdmin);
    }
    return _buildMaterial(context, ref, statsState, user, isAdmin);
  }

  Widget _buildMaterial(
    BuildContext context,
    WidgetRef ref,
    AsyncValue statsState,
    dynamic user,
    bool isAdmin,
  ) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isAdmin ? 'Admin Dashboard' : 'My Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.go('/profile'),
            tooltip: 'Profile',
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () =>
                ref.read(authControllerProvider.notifier).logout(),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () =>
            ref.read(dashboardControllerProvider.notifier).refresh(),
        child: _buildBody(context, ref, statsState, user, isAdmin, false),
      ),
      floatingActionButton: isAdmin
          ? FloatingActionButton.extended(
              icon: const Icon(Icons.directions_walk),
              label: const Text('Start Walk'),
              onPressed: () => context.go('/walks/active'),
            )
          : null,
    );
  }

  Widget _buildCupertino(
    BuildContext context,
    WidgetRef ref,
    AsyncValue statsState,
    dynamic user,
    bool isAdmin,
  ) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: Text(isAdmin ? 'Admin Dashboard' : 'My Dashboard'),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            CupertinoButton(
              padding: EdgeInsets.zero,
              onPressed: () => context.go('/profile'),
              child: const Icon(CupertinoIcons.person),
            ),
            CupertinoButton(
              padding: EdgeInsets.zero,
              onPressed: () =>
                  ref.read(authControllerProvider.notifier).logout(),
              child: const Icon(CupertinoIcons.square_arrow_right),
            ),
          ],
        ),
      ),
      child: SafeArea(
        child: _buildBody(context, ref, statsState, user, isAdmin, true),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    WidgetRef ref,
    AsyncValue statsState,
    dynamic user,
    bool isAdmin,
    bool isIOS,
  ) {
    return statsState.when(
      loading: () => const LoadingIndicator(),
      error: (err, _) => ErrorView(
        message: err.toString(),
        onRetry: () =>
            ref.read(dashboardControllerProvider.notifier).refresh(),
      ),
      data: (stats) => stats == null
          ? const Center(child: Text('No data available'))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(
                  'Welcome, ${user?.fullName ?? 'User'}!',
                  style: isIOS
                      ? const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold)
                      : Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 16),
                if (isAdmin) ...[
                  _StatsGrid(
                    isIOS: isIOS,
                    stats: [
                      _Stat(
                        'Total Clients',
                        stats.totalClients,
                        isIOS
                            ? CupertinoIcons.person_2
                            : Icons.people,
                      ),
                      _Stat(
                        'Total Pets',
                        stats.totalPets,
                        isIOS ? CupertinoIcons.paw : Icons.pets,
                      ),
                      _Stat(
                        'Bookings This Month',
                        stats.bookingsThisMonth,
                        isIOS
                            ? CupertinoIcons.calendar
                            : Icons.calendar_month,
                      ),
                      _Stat(
                        'Incidents This Month',
                        stats.incidentsThisMonth,
                        isIOS
                            ? CupertinoIcons.exclamationmark_triangle
                            : Icons.warning_amber,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _buildActionButton(
                    context,
                    isIOS: isIOS,
                    icon: isIOS ? CupertinoIcons.list_bullet : Icons.list,
                    label: 'View Bookings',
                    onPressed: () => context.go('/bookings'),
                  ),
                  const SizedBox(height: 8),
                  _buildActionButton(
                    context,
                    isIOS: isIOS,
                    icon: isIOS
                        ? CupertinoIcons.walk
                        : Icons.directions_walk,
                    label: 'Walk History',
                    onPressed: () => context.go('/walks'),
                  ),
                ] else ...[
                  _StatsGrid(
                    isIOS: isIOS,
                    stats: [
                      _Stat(
                        'Bookings This Month',
                        stats.bookingsThisMonth,
                        isIOS
                            ? CupertinoIcons.calendar
                            : Icons.calendar_month,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _buildActionButton(
                    context,
                    isIOS: isIOS,
                    icon: isIOS ? CupertinoIcons.list_bullet : Icons.list,
                    label: 'My Bookings',
                    onPressed: () => context.go('/bookings'),
                  ),
                ],
                if (isAdmin && isIOS) ...[
                  const SizedBox(height: 24),
                  CupertinoButton.filled(
                    onPressed: () => context.go('/walks/active'),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(CupertinoIcons.walk),
                        SizedBox(width: 8),
                        Text('Start Walk'),
                      ],
                    ),
                  ),
                ],
              ],
            ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required bool isIOS,
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    if (isIOS) {
      return CupertinoButton(
        onPressed: onPressed,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon),
            const SizedBox(width: 8),
            Text(label),
          ],
        ),
      );
    }
    return ElevatedButton.icon(
      icon: Icon(icon),
      label: Text(label),
      onPressed: onPressed,
    );
  }
}

class _Stat {
  _Stat(this.label, this.value, this.icon);
  final String label;
  final int value;
  final IconData icon;
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid({required this.stats, required this.isIOS});
  final List<_Stat> stats;
  final bool isIOS;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.5,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: stats
          .map(
            (s) => Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(s.icon, size: 28),
                    const SizedBox(height: 8),
                    Text(
                      s.value.toString(),
                      style: isIOS
                          ? const TextStyle(
                              fontSize: 28, fontWeight: FontWeight.bold)
                          : Theme.of(context).textTheme.headlineMedium,
                    ),
                    Text(
                      s.label,
                      textAlign: TextAlign.center,
                      style: isIOS
                          ? const TextStyle(fontSize: 12)
                          : Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}

