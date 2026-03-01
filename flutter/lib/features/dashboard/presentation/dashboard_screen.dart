import 'package:dog_walking_app/features/auth/presentation/auth_controller.dart';
import 'package:dog_walking_app/features/dashboard/presentation/dashboard_controller.dart';
import 'package:dog_walking_app/shared/widgets/error_view.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
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
        child: statsState.when(
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
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 16),
                    if (isAdmin) ...[
                      _StatsGrid(stats: [
                        _Stat(
                          'Total Clients',
                          stats.totalClients,
                          Icons.people,
                        ),
                        _Stat('Total Pets', stats.totalPets, Icons.pets),
                        _Stat(
                          'Bookings This Month',
                          stats.bookingsThisMonth,
                          Icons.calendar_month,
                        ),
                        _Stat(
                          'Incidents This Month',
                          stats.incidentsThisMonth,
                          Icons.warning_amber,
                        ),
                      ]),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.list),
                        label: const Text('View Bookings'),
                        onPressed: () => context.go('/bookings'),
                      ),
                      const SizedBox(height: 8),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.directions_walk),
                        label: const Text('Walk History'),
                        onPressed: () => context.go('/walks'),
                      ),
                    ] else ...[
                      _StatsGrid(stats: [
                        _Stat(
                          'Bookings This Month',
                          stats.bookingsThisMonth,
                          Icons.calendar_month,
                        ),
                      ]),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.list),
                        label: const Text('My Bookings'),
                        onPressed: () => context.go('/bookings'),
                      ),
                    ],
                  ],
                ),
        ),
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
}

class _Stat {
  _Stat(this.label, this.value, this.icon);
  final String label;
  final int value;
  final IconData icon;
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid({required this.stats});
  final List<_Stat> stats;

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
                    Icon(s.icon, size: 28, color: Colors.brown),
                    const SizedBox(height: 8),
                    Text(
                      s.value.toString(),
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    Text(
                      s.label,
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall,
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
