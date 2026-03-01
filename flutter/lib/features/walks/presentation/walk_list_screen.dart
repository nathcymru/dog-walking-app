import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';
import 'package:dog_walking_app/shared/widgets/error_view.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final _walkListProvider = FutureProvider<List<WalkEntity>>((ref) async {
  // Walk list is part of admin slots/bookings, so we'll show a placeholder
  // that integrates with walk detail navigation.
  return [];
});

class WalkListScreen extends ConsumerWidget {
  const WalkListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final walksState = ref.watch(_walkListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Walk History')),
      body: walksState.when(
        loading: () => const LoadingIndicator(),
        error: (err, _) => ErrorView(
          message: err.toString(),
          onRetry: () => ref.invalidate(_walkListProvider),
        ),
        data: (walks) => walks.isEmpty
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.directions_walk, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('No walk history yet.'),
                  ],
                ),
              )
            : ListView.separated(
                padding: const EdgeInsets.all(8),
                itemCount: walks.length,
                separatorBuilder: (_, __) => const Divider(),
                itemBuilder: (ctx, i) {
                  final walk = walks[i];
                  return ListTile(
                    leading: const Icon(Icons.directions_walk),
                    title: Text('Walk ${walk.id}'),
                    subtitle: Text(walk.startedAt.toLocal().toString()),
                    trailing: Text(walk.status),
                    onTap: () => context.go('/walk/${walk.id}'),
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.play_arrow),
        label: const Text('Start Walk'),
        onPressed: () => context.go('/walks/active'),
      ),
    );
  }
}
