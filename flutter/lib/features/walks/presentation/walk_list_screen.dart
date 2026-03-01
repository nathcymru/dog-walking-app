import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';
import 'package:dog_walking_app/shared/platform_helpers.dart';
import 'package:dog_walking_app/shared/widgets/error_view.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
import 'package:flutter/cupertino.dart';
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
    final isIOS = isCupertinoPlatform;

    if (isIOS) {
      return _buildCupertino(context, ref, walksState);
    }
    return _buildMaterial(context, ref, walksState);
  }

  Widget _buildMaterial(
    BuildContext context,
    WidgetRef ref,
    AsyncValue<List<WalkEntity>> walksState,
  ) {
    return Scaffold(
      appBar: AppBar(title: const Text('Walk History')),
      body: _buildBody(context, ref, walksState, false),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.play_arrow),
        label: const Text('Start Walk'),
        onPressed: () => context.go('/walks/active'),
      ),
    );
  }

  Widget _buildCupertino(
    BuildContext context,
    WidgetRef ref,
    AsyncValue<List<WalkEntity>> walksState,
  ) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: const Text('Walk History'),
        trailing: CupertinoButton(
          padding: EdgeInsets.zero,
          onPressed: () => context.go('/walks/active'),
          child: const Icon(CupertinoIcons.play_arrow_solid),
        ),
      ),
      child: SafeArea(
        child: _buildBody(context, ref, walksState, true),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    WidgetRef ref,
    AsyncValue<List<WalkEntity>> walksState,
    bool isIOS,
  ) {
    return walksState.when(
      loading: () => const LoadingIndicator(),
      error: (err, _) => ErrorView(
        message: err.toString(),
        onRetry: () => ref.invalidate(_walkListProvider),
      ),
      data: (walks) => walks.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    isIOS
                        ? CupertinoIcons.walk
                        : Icons.directions_walk,
                    size: 64,
                  ),
                  const SizedBox(height: 16),
                  const Text('No walk history yet.'),
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
                  leading: Icon(
                    isIOS
                        ? CupertinoIcons.walk
                        : Icons.directions_walk,
                  ),
                  title: Text('Walk ${walk.id}'),
                  subtitle: Text(walk.startedAt.toLocal().toString()),
                  trailing: Text(walk.status),
                  onTap: () => context.go('/walk/${walk.id}'),
                );
              },
            ),
    );
  }
}

