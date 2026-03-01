import 'dart:async';

import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:dog_walking_app/features/gps/presentation/gps_session_controller.dart';
import 'package:dog_walking_app/features/walks/presentation/active_walk_controller.dart';
import 'package:dog_walking_app/shared/platform_helpers.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ActiveWalkScreen extends ConsumerStatefulWidget {
  const ActiveWalkScreen({super.key});

  @override
  ConsumerState<ActiveWalkScreen> createState() => _ActiveWalkScreenState();
}

class _ActiveWalkScreenState extends ConsumerState<ActiveWalkScreen> {
  Timer? _timer;
  Duration _elapsed = Duration.zero;
  DateTime? _startTime;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _startWalk());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _startWalk() async {
    await ref.read(activeWalkControllerProvider.notifier).startWalk();
    _startTime = DateTime.now();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        _elapsed = DateTime.now().difference(_startTime!);
      });
    });
  }

  Future<void> _endWalk() async {
    final isIOS = isCupertinoPlatform;
    bool? confirmed;

    if (isIOS) {
      confirmed = await showCupertinoDialog<bool>(
        context: context,
        builder: (ctx) => CupertinoAlertDialog(
          title: const Text('End Walk'),
          content: const Text('Are you sure you want to end this walk?'),
          actions: [
            CupertinoDialogAction(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: const Text('Cancel'),
            ),
            CupertinoDialogAction(
              isDestructiveAction: true,
              onPressed: () => Navigator.of(ctx).pop(true),
              child: const Text('End Walk'),
            ),
          ],
        ),
      );
    } else {
      confirmed = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('End Walk'),
          content: const Text('Are you sure you want to end this walk?'),
          actions: [
            TextButton(
              onPressed: () => ctx.pop(false),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () => ctx.pop(true),
              child: const Text('End Walk'),
            ),
          ],
        ),
      );
    }
    if (confirmed != true) return;

    _timer?.cancel();
    await ref.read(activeWalkControllerProvider.notifier).endWalk();
    if (!mounted) return;
    final walkState = ref.read(activeWalkControllerProvider);
    walkState.whenOrNull(
      data: (walk) {
        if (walk != null) {
          context.go('/walk/${walk.id}');
        } else {
          context.go('/dashboard');
        }
      },
    );
  }

  String _formatDuration(Duration d) {
    final h = d.inHours.toString().padLeft(2, '0');
    final m = (d.inMinutes % 60).toString().padLeft(2, '0');
    final s = (d.inSeconds % 60).toString().padLeft(2, '0');
    return '$h:$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final walkState = ref.watch(activeWalkControllerProvider);
    final gpsPoints = ref.watch(gpsSessionControllerProvider).valueOrNull ?? [];
    final latestPoint = gpsPoints.isNotEmpty ? gpsPoints.last : null;

    if (isCupertinoPlatform) {
      return _buildCupertino(walkState, gpsPoints, latestPoint);
    }
    return _buildMaterial(walkState, gpsPoints, latestPoint);
  }

  Widget _buildMaterial(
    AsyncValue walkState,
    List<GpsPointEntity> gpsPoints,
    GpsPointEntity? latestPoint,
  ) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Active Walk'),
        automaticallyImplyLeading: false,
      ),
      body: walkState.when(
        loading: () => const LoadingIndicator(),
        error: (err, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48),
              const SizedBox(height: 16),
              Text('Failed to start walk: $err'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/dashboard'),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
        data: (walk) => _buildWalkContent(gpsPoints, latestPoint, false),
      ),
    );
  }

  Widget _buildCupertino(
    AsyncValue walkState,
    List<GpsPointEntity> gpsPoints,
    GpsPointEntity? latestPoint,
  ) {
    return CupertinoPageScaffold(
      navigationBar: const CupertinoNavigationBar(
        middle: Text('Active Walk'),
        automaticallyImplyLeading: false,
      ),
      child: SafeArea(
        child: walkState.when(
          loading: () => const LoadingIndicator(),
          error: (err, _) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(CupertinoIcons.exclamationmark_circle, size: 48),
                const SizedBox(height: 16),
                Text('Failed to start walk: $err'),
                const SizedBox(height: 16),
                CupertinoButton(
                  onPressed: () => context.go('/dashboard'),
                  child: const Text('Go Back'),
                ),
              ],
            ),
          ),
          data: (walk) => _buildWalkContent(gpsPoints, latestPoint, true),
        ),
      ),
    );
  }

  Widget _buildWalkContent(
    List<GpsPointEntity> gpsPoints,
    GpsPointEntity? latestPoint,
    bool isIOS,
  ) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Text(
                    _formatDuration(_elapsed),
                    style: isIOS
                        ? const TextStyle(
                            fontSize: 48, fontWeight: FontWeight.bold)
                        : Theme.of(context)
                            .textTheme
                            .displayMedium
                            ?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text('Walk Duration'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'GPS Status',
                    style: isIOS
                        ? const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600)
                        : Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  _GpsAccuracyIndicator(
                      point: latestPoint, isIOS: isIOS),
                  const SizedBox(height: 4),
                  Text('Points collected: ${gpsPoints.length}'),
                ],
              ),
            ),
          ),
          const Spacer(),
          if (isIOS) ...[
            CupertinoButton(
              onPressed: () => ref
                  .read(activeWalkControllerProvider.notifier)
                  .capturePhoto(),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(CupertinoIcons.camera),
                  SizedBox(width: 8),
                  Text('Take Photo'),
                ],
              ),
            ),
            const SizedBox(height: 12),
            CupertinoButton.filled(
              onPressed: _endWalk,
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(CupertinoIcons.stop_circle),
                  SizedBox(width: 8),
                  Text('End Walk'),
                ],
              ),
            ),
          ] else ...[
            ElevatedButton.icon(
              icon: const Icon(Icons.camera_alt),
              label: const Text('Take Photo'),
              onPressed: () => ref
                  .read(activeWalkControllerProvider.notifier)
                  .capturePhoto(),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              icon: const Icon(Icons.stop_circle),
              label: const Text('End Walk'),
              onPressed: _endWalk,
            ),
          ],
        ],
      ),
    );
  }
}

class _GpsAccuracyIndicator extends StatelessWidget {
  const _GpsAccuracyIndicator({this.point, required this.isIOS});
  final GpsPointEntity? point;
  final bool isIOS;

  @override
  Widget build(BuildContext context) {
    if (point == null) {
      return Row(
        children: [
          Icon(isIOS ? CupertinoIcons.location_slash : Icons.gps_not_fixed),
          const SizedBox(width: 8),
          const Text('Acquiring GPS...'),
        ],
      );
    }
    final accuracy = point!.accuracy;
    final label = accuracy <= 10
        ? 'Excellent'
        : accuracy <= 30
            ? 'Good'
            : 'Poor';
    return Row(
      children: [
        Icon(isIOS ? CupertinoIcons.location_solid : Icons.gps_fixed),
        const SizedBox(width: 8),
        Text('Accuracy: ${accuracy.toStringAsFixed(1)}m ($label)'),
      ],
    );
  }
}

