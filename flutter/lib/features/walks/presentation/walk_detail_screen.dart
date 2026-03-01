import 'package:dog_walking_app/core/networking/providers.dart';
import 'package:dog_walking_app/features/walks/data/walk_api.dart';
import 'package:dog_walking_app/features/walks/data/walk_repository_impl.dart';
import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';
import 'package:dog_walking_app/features/walks/domain/walk_repository.dart';
import 'package:dog_walking_app/shared/widgets/error_view.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final _walkDetailProvider =
    FutureProvider.family<WalkEntity, String>((ref, walkId) async {
  final repo = WalkRepositoryImpl(WalkApi(ref.watch(dioProvider)));
  final result = await repo.getWalk(walkId);
  return switch (result) {
    Success(:final value) => value,
    Err(:final failure) => throw failure,
  };
});

class WalkDetailScreen extends ConsumerWidget {
  const WalkDetailScreen({super.key, required this.walkId});
  final String walkId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final walkState = ref.watch(_walkDetailProvider(walkId));

    return Scaffold(
      appBar: AppBar(title: const Text('Walk Details')),
      body: walkState.when(
        loading: () => const LoadingIndicator(),
        error: (err, _) => ErrorView(
          message: err.toString(),
          onRetry: () => ref.invalidate(_walkDetailProvider(walkId)),
        ),
        data: (walk) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _DetailCard(
              title: 'Status',
              value: walk.status.toUpperCase(),
              icon: walk.status == 'active'
                  ? Icons.directions_walk
                  : Icons.check_circle,
            ),
            const SizedBox(height: 12),
            _DetailCard(
              title: 'Started At',
              value: walk.startedAt.toLocal().toString(),
              icon: Icons.play_arrow,
            ),
            if (walk.endedAt != null) ...[
              const SizedBox(height: 12),
              _DetailCard(
                title: 'Ended At',
                value: walk.endedAt!.toLocal().toString(),
                icon: Icons.stop,
              ),
            ],
            if (walk.durationSeconds != null) ...[
              const SizedBox(height: 12),
              _DetailCard(
                title: 'Duration',
                value: _formatDuration(
                  Duration(seconds: walk.durationSeconds!),
                ),
                icon: Icons.timer,
              ),
            ],
            const SizedBox(height: 12),
            _DetailCard(
              title: 'GPS Points',
              value: walk.points.length.toString(),
              icon: Icons.location_on,
            ),
          ],
        ),
      ),
    );
  }

  String _formatDuration(Duration d) {
    final h = d.inHours;
    final m = d.inMinutes % 60;
    final s = d.inSeconds % 60;
    if (h > 0) return '${h}h ${m}m ${s}s';
    if (m > 0) return '${m}m ${s}s';
    return '${s}s';
  }
}

class _DetailCard extends StatelessWidget {
  const _DetailCard({
    required this.title,
    required this.value,
    required this.icon,
  });
  final String title;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: Colors.brown),
        title: Text(title, style: Theme.of(context).textTheme.bodySmall),
        subtitle: Text(
          value,
          style: Theme.of(context).textTheme.titleMedium,
        ),
      ),
    );
  }
}
