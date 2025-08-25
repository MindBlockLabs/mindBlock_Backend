import { Module } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './providers/achievement.service';
import { AchievementUnlockerProvider } from './providers/achievement-unlocker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user-achievement.entity';
import { Achievement } from './entities/achievement.entity';
import { FindByUserIdProvider } from './providers/find-by-user-id-provider';
import { LeaderboardEntry } from '../leaderboard/entities/leaderboard.entity';
import { Badge } from '../badge/entities/badge.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement, LeaderboardEntry, Badge, User])],
  controllers: [AchievementController],
  providers: [AchievementService, AchievementUnlockerProvider, FindByUserIdProvider],
  exports: [AchievementService]
})
export class AchievementModule {}
