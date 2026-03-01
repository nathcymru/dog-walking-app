import 'package:hive/hive.dart';

/// Abstract local cache interface backed by Hive.
abstract class LocalCache {
  Future<void> put<T>(String box, String key, T value);
  Future<T?> get<T>(String box, String key);
  Future<void> delete(String box, String key);
  Future<List<T>> getAll<T>(String box);
}

/// Hive implementation of [LocalCache].
class HiveLocalCache implements LocalCache {
  @override
  Future<void> put<T>(String boxName, String key, T value) async {
    final box = Hive.box(boxName);
    await box.put(key, value);
  }

  @override
  Future<T?> get<T>(String boxName, String key) async {
    final box = Hive.box(boxName);
    return box.get(key) as T?;
  }

  @override
  Future<void> delete(String boxName, String key) async {
    final box = Hive.box(boxName);
    await box.delete(key);
  }

  @override
  Future<List<T>> getAll<T>(String boxName) async {
    final box = Hive.box(boxName);
    return box.values.cast<T>().toList();
  }
}
