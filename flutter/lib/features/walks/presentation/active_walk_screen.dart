import 'dart:async';

import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:dog_walking_app/features/gps/presentation/gps_session_controller.dart';
import 'package:dog_walking_app/features/walks/presentation/active_walk_controller.dart';
import 'package:dog_walking_app/shared/widgets/loading_indicator.dart';
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
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('End Walk'),
        content: const Text('Are you sure you want to end this walk?'),
        actions: [
          TextButton(
            onPressed: () => ctx.pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => ctx.pop(true),
            child: const Text('End Walk'),
          ),
        ],
      ),
    );
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
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
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
        data: (walk) => Padding(
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
                        style:
                            Theme.of(context).textTheme.displayMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
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
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      _GpsAccuracyIndicator(point: latestPoint),
                      const SizedBox(height: 4),
                      Text('Points collected: ${gpsPoints.length}'),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              ElevatedButton.icon(
                icon: const Icon(Icons.camera_alt),
                label: const Text('Take Photo'),
                onPressed: () =>
                    ref.read(activeWalkControllerProvider.notifier).capturePhoto(),
              ),
              const SizedBox(height: 12),
              FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                icon: const Icon(Icons.stop_circle),
                label: const Text('End Walk'),
                onPressed: _endWalk,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GpsAccuracyIndicator extends StatelessWidget {
  const _GpsAccuracyIndicator({this.point});
  final GpsPointEntity? point;

  @override
  Widget build(BuildContext context) {
    if (point == null) {
      return const Row(
        children: [
          Icon(Icons.gps_not_fixed, color: Colors.grey),
          SizedBox(width: 8),
          Text('Acquiring GPS...'),
        ],
      );
    }
    final accuracy = point!.accuracy;
    final color = accuracy <= 10
        ? Colors.green
        : accuracy <= 30
            ? Colors.orange
            : Colors.red;
    final label = accuracy <= 10
        ? 'Excellent'
        : accuracy <= 30
            ? 'Good'
            : 'Poor';
    return Row(
      children: [
        Icon(Icons.gps_fixed, color: color),
        const SizedBox(width: 8),
        Text('Accuracy: ${accuracy.toStringAsFixed(1)}m ($label)'),
      ],
    );
  }
}
