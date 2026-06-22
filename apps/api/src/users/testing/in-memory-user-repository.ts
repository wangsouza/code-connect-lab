import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * Fake in-memory implementation of the User repository for unit tests,
 * so specs run without a real PostgreSQL connection. Covers only the
 * subset of the TypeORM Repository API used by UsersService.
 */
export function createInMemoryUserRepository(): Pick<
  Repository<User>,
  'create' | 'save' | 'findOne'
> {
  const store = new Map<string, User>();

  return {
    create: (data: Partial<User>) => ({ ...data }) as User,
    save: (user: User) => {
      if (!user.id) {
        user.id = randomUUID();
      }
      store.set(user.id, { ...user });
      return Promise.resolve(user);
    },
    findOne: ({ where }: { where: Partial<User> }) => {
      const match = [...store.values()].find((user) =>
        Object.entries(where).every(
          ([key, value]) => user[key as keyof User] === value,
        ),
      );
      return Promise.resolve(match ?? null);
    },
  } as Pick<Repository<User>, 'create' | 'save' | 'findOne'>;
}
