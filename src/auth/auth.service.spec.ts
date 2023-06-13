import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/entities';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

describe.only('AuthService', () => {
  let service: AuthService;
  let users_service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, {
        provide: getRepositoryToken(User),
        useValue: {}
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    users_service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      jest
        .spyOn(users_service, 'find_by_name')
        .mockImplementationOnce(async () => null);

      await expect(service.login({ username: 'test', password: 'test' }))
        .rejects.toThrow('Invalid login/password');
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      jest
        .spyOn(users_service, 'find_by_name')
        .mockImplementationOnce(async () => ({ password: 'wrong' } as User));

      await expect(service.login({ username: 'test', password: 'test' }))
        .rejects
        .toThrow('Invalid login/password');
    });

    it('should return a token if login is successful', async () => {
      const password = await bcrypt.hash('test', 10);
      jest
        .spyOn(users_service, 'find_by_name')
        .mockImplementation(async () => ({ id: 1, password, balance: 1000 } as User));

      const result = await service.login({ username: 'test', password: 'test' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('expires_in');
      expect(result).toHaveProperty('balance');
    });
  });

  describe('get_access_token', () => {
    it('should return a token', () => {
      const result = service.get_access_token(1);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('expires_in');
    });
  });
});
