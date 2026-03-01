class UserEntity {
  const UserEntity({
    required this.id,
    required this.email,
    required this.role,
    required this.fullName,
  });

  final int id;
  final String email;
  final String role; // 'admin' | 'client'
  final String fullName;
}
