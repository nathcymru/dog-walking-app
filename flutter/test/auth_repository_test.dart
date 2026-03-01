import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/token_store.dart';
import 'package:dog_walking_app/features/auth/data/auth_api.dart';
import 'package:dog_walking_app/features/auth/data/auth_repository_impl.dart';
import 'package:dog_walking_app/features/auth/domain/user_entity.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthApi extends Mock implements AuthApi {}

class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

void main() {
  late MockAuthApi mockApi;
  late MockFlutterSecureStorage mockStorage;
  late AuthRepositoryImpl repository;

  setUp(() {
    mockApi = MockAuthApi();
    mockStorage = MockFlutterSecureStorage();
    repository = AuthRepositoryImpl(
      authApi: mockApi,
      tokenStore: TokenStore(mockStorage),
    );
  });

  group('AuthRepositoryImpl.login', () {
    test('returns Success with UserEntity on valid credentials', () async {
      when(() => mockApi.login(any(), any())).thenAnswer(
        (_) async => (
          user: UserDto(
            id: 1,
            email: 'test@example.com',
            role: 'admin',
            fullName: 'Test User',
          ),
          accessToken: 'access123',
          refreshToken: 'refresh123',
        ),
      );
      when(
        () => mockStorage.write(key: any(named: 'key'), value: any(named: 'value')),
      ).thenAnswer((_) async {});

      final result = await repository.login('test@example.com', 'password');

      expect(result, isA<Success<UserEntity>>());
      final user = (result as Success<UserEntity>).value;
      expect(user.email, 'test@example.com');
      expect(user.role, 'admin');
    });

    test('returns Err with UnauthorizedFailure on 401', () async {
      when(() => mockApi.login(any(), any())).thenThrow(
        DioException(
          requestOptions: RequestOptions(path: '/api/auth/login'),
          response: Response(
            requestOptions: RequestOptions(path: '/api/auth/login'),
            statusCode: 401,
          ),
          type: DioExceptionType.badResponse,
        ),
      );

      final result = await repository.login('test@example.com', 'wrong');

      expect(result, isA<Err<UserEntity>>());
      expect((result as Err<UserEntity>).failure, isA<UnauthorizedFailure>());
    });

    test('returns Err with OfflineFailure on connection error', () async {
      when(() => mockApi.login(any(), any())).thenThrow(
        DioException(
          requestOptions: RequestOptions(path: '/api/auth/login'),
          type: DioExceptionType.connectionError,
        ),
      );

      final result = await repository.login('test@example.com', 'password');

      expect(result, isA<Err<UserEntity>>());
      expect((result as Err<UserEntity>).failure, isA<OfflineFailure>());
    });
  });

  group('AuthRepositoryImpl.getSession', () {
    test('returns Success with null when no session', () async {
      when(() => mockApi.getSession()).thenAnswer((_) async => null);

      final result = await repository.getSession();

      expect(result, isA<Success<UserEntity?>>());
      expect((result as Success<UserEntity?>).value, isNull);
    });

    test('returns Success with UserEntity when session exists', () async {
      when(() => mockApi.getSession()).thenAnswer(
        (_) async => UserDto(
          id: 2,
          email: 'client@example.com',
          role: 'client',
          fullName: 'Client User',
        ),
      );

      final result = await repository.getSession();

      expect(result, isA<Success<UserEntity?>>());
      final user = (result as Success<UserEntity?>).value;
      expect(user?.role, 'client');
    });
  });
}
