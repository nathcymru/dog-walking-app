class GpsPointEntity {
  const GpsPointEntity({
    required this.lat,
    required this.lng,
    required this.timestamp,
    required this.accuracy,
    this.speed,
  });

  final double lat;
  final double lng;
  final DateTime timestamp;
  final double accuracy;
  final double? speed;

  Map<String, dynamic> toJson() => {
        'lat': lat,
        'lng': lng,
        'timestamp': timestamp.toIso8601String(),
        'accuracy': accuracy,
        'speed': speed,
      };

  factory GpsPointEntity.fromJson(Map<String, dynamic> json) => GpsPointEntity(
        lat: (json['lat'] as num).toDouble(),
        lng: (json['lng'] as num).toDouble(),
        timestamp: DateTime.parse(json['timestamp'] as String),
        accuracy: (json['accuracy'] as num).toDouble(),
        speed: json['speed'] != null
            ? (json['speed'] as num).toDouble()
            : null,
      );
}
