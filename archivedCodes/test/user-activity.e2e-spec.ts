import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { PuzzleSubmission } from '../src/puzzle/entities/puzzle-submission.entity';
import { UserAchievement } from '../src/achievement/entities/user-achievement.entity';

describe('User Activity (e2e)', () => {
  let app: INestApplication;
  let userRepo;
  let puzzleSubmissionRepo;
  let userAchievementRepo;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    userRepo = moduleFixture.get(getRepositoryToken(User));
    puzzleSubmissionRepo = moduleFixture.get(getRepositoryToken(PuzzleSubmission));
    userAchievementRepo = moduleFixture.get(getRepositoryToken(UserAchievement));

    // Create a test user
    const user = userRepo.create({ username: 'testuser', email: 'test@example.com', password: 'testpass' });
    await userRepo.save(user);
    userId = user.id;

    // Create a correct puzzle submission
    await puzzleSubmissionRepo.save({
      user,
      isCorrect: true,
      puzzle: { title: 'Binary Tree Maximum Depth' },
      createdAt: new Date('2025-07-05T08:00:00Z'),
    });

    // Create an achievement
    await userAchievementRepo.save({
      user,
      achievement: { title: 'Code Ninja' },
      unlockedAt: new Date('2025-07-04T16:30:00Z'),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return recent activity for a user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}/activity?page=1&limit=5`)
      .expect(200);
    expect(res.body.activities).toBeDefined();
    expect(res.body.activities.length).toBeGreaterThan(0);
    expect(res.body.activities[0]).toHaveProperty('description');
    expect(res.body.activities[0]).toHaveProperty('timestamp');
  });

  it('should return 404 for non-existent user', async () => {
    await request(app.getHttpServer())
      .get('/users/nonexistentid/activity')
      .expect(404);
  });

  it('should validate pagination params', async () => {
    await request(app.getHttpServer())
      .get(`/users/${userId}/activity?page=0&limit=0`)
      .expect(400);
  });
});