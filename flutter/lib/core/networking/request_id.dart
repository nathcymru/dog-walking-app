import 'package:uuid/uuid.dart';

class RequestId {
  RequestId._();
  static const _uuid = Uuid();
  static String newId() => _uuid.v4();
}
