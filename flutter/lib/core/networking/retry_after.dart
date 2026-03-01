/// Parses the `Retry-After` HTTP header value.
/// Supports integer seconds or HTTP-date format.
class RetryAfter {
  RetryAfter._();

  static Duration? parse(String? value) {
    if (value == null || value.isEmpty) return null;

    // Try integer seconds first
    final seconds = int.tryParse(value.trim());
    if (seconds != null) {
      return Duration(seconds: seconds);
    }

    // Try HTTP-date format (RFC 7231)
    try {
      final date = HttpDate.parse(value.trim());
      final diff = date.difference(DateTime.now().toUtc());
      return diff.isNegative ? Duration.zero : diff;
    } catch (_) {
      return null;
    }
  }
}

/// Minimal HTTP-date parser for Retry-After header.
class HttpDate {
  HttpDate._();

  static final _months = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
  };

  /// Parses RFC 7231 HTTP-date, e.g. "Thu, 01 Jan 2026 00:00:00 GMT".
  static DateTime parse(String value) {
    final parts = value.split(RegExp(r'[\s,]+'));
    // Format: Day, DD Mon YYYY HH:MM:SS GMT
    // parts: [Weekday, DD, Mon, YYYY, HH:MM:SS, GMT]
    final day = int.parse(parts[1]);
    final month = _months[parts[2]] ?? 1;
    final year = int.parse(parts[3]);
    final timeParts = parts[4].split(':');
    final hour = int.parse(timeParts[0]);
    final minute = int.parse(timeParts[1]);
    final second = int.parse(timeParts[2]);
    return DateTime.utc(year, month, day, hour, minute, second);
  }
}
