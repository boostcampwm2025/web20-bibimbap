import { PrismaClient, AuthProvider, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import fs from 'node:fs/promises';
import path from 'node:path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedLoadtest(prismaClient: PrismaClient, count: number) {
  const rootDir = path.resolve(__dirname, '../..');
  const outputPath = path.join(rootDir, 'load-test/k6/data/users.json');

  const password = 'pw123';
  const prefix = 'loadtest';
  const BATCH = 500;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('환경변수 JWT_SECRET 이 필요합니다.');

  const jwtExpiresIn =
    (process.env.JWT_EXPIRES_IN as StringValue | undefined) ?? '1d';
  const jwt = new JwtService({
    secret: jwtSecret,
    signOptions: { expiresIn: jwtExpiresIn },
  });

  // 비밀번호 해시(공통)
  const passwordHash = await bcrypt.hash(password, 10);

  // 기존 loadtest 계정 정리
  const oldAuths = await prismaClient.authAccount.findMany({
    where: {
      provider: AuthProvider.INTERNAL,
      providerId: { startsWith: `${prefix}_` },
    },
    select: { userId: true },
  });

  const oldUserIds = oldAuths.map((a) => a.userId);

  await prismaClient.authAccount.deleteMany({
    where: {
      provider: AuthProvider.INTERNAL,
      providerId: { startsWith: `${prefix}_` },
    },
  });

  if (oldUserIds.length > 0) {
    await prismaClient.user.deleteMany({
      where: { id: { in: oldUserIds } },
    });
  }

  // User createMany
  const userRows = Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(5, '0');
    const username = `${prefix}_${n}`;
    return {
      username,
      name: `Load Test ${n}`,
      role: Role.USER,
    };
  });

  for (let i = 0; i < userRows.length; i += BATCH) {
    await prismaClient.user.createMany({
      data: userRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }

  // 생성된 User id 매핑
  const createdUsers = await prismaClient.user.findMany({
    where: { username: { startsWith: `${prefix}_` } },
    select: { id: true, username: true, role: true },
  });

  const userIdByUsername = new Map(createdUsers.map((u) => [u.username, u.id]));

  // AuthAccount createMany
  const authRows = userRows.map((u) => {
    const userId = userIdByUsername.get(u.username);
    if (!userId) throw new Error(`User not found for username: ${u.username}`);
    return {
      provider: AuthProvider.INTERNAL,
      providerId: u.username,
      passwordHash,
      userId,
    };
  });

  for (let i = 0; i < authRows.length; i += BATCH) {
    await prismaClient.authAccount.createMany({
      data: authRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }

  // JWT 토큰 발급
  const usersJson = JSON.stringify(
    createdUsers.map((u) => {
      const token = jwt.sign({ sub: u.id, role: u.role });
      return {
        id: u.username,
        password,
        userId: u.id,
        token,
        cookie: `access_token=${token}`,
      };
    }),
  );

  // 파일로 저장
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, usersJson, 'utf8');

  console.log(`✅ Seeded ${count} loadtest users`);
  console.log(`📄 Users JSON 파일 생성: ${outputPath}`);
}

async function main() {
  const raw = process.env.LOADTEST_COUNT ?? '10000';
  const count = Number(raw);

  await seedLoadtest(prisma, count);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Loadtest seed 실패:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
