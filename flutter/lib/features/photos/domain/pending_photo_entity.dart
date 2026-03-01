class PendingPhotoEntity {
  PendingPhotoEntity({
    required this.walkId,
    required this.localPath,
    required this.contentType,
    required this.timestamp,
    this.gpsPointIndex,
    this.retryCount = 0,
  });

  final String walkId;
  final String localPath;
  final String contentType;
  final int? gpsPointIndex;
  final DateTime timestamp;
  final int retryCount;

  Map<String, dynamic> toJson() => {
        'walkId': walkId,
        'localPath': localPath,
        'contentType': contentType,
        'gpsPointIndex': gpsPointIndex,
        'timestamp': timestamp.toIso8601String(),
        'retryCount': retryCount,
      };

  factory PendingPhotoEntity.fromJson(Map<String, dynamic> json) =>
      PendingPhotoEntity(
        walkId: json['walkId'] as String,
        localPath: json['localPath'] as String,
        contentType: json['contentType'] as String,
        gpsPointIndex: json['gpsPointIndex'] as int?,
        timestamp: DateTime.parse(json['timestamp'] as String),
        retryCount: (json['retryCount'] as int?) ?? 0,
      );
}
