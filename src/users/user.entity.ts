import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { userRole } from '../enums/userRole.enum';
import { LeaderboardEntry } from 'src/leaderboard/entities/leaderboard.entity';

/** Structure of the users table */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 150, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 225, nullable: true })
  password: string;

  /**
   * Unique username (replaces firstname + lastname)
   */
  @ApiProperty({ example: 'fatimaaminu', description: 'Unique username' })
  @Column('varchar', { length: 100, nullable: false, unique: true })
  username: string;

  /**
   * Role of the user.
   */
  @ApiProperty({
    enum: userRole,
    example: userRole.USER,
    description: 'Role of the user',
  })
  @Column({ type: 'enum', enum: userRole, default: userRole.USER })
  userRole?: userRole;

  /**
   * Google ID (if signed up with Google).
   */
  @ApiProperty({
    example: 'google-unique-id',
    description: 'Google ID of the user',
    required: false,
  })
  @Column('varchar', { length: 225, nullable: true })
  googleId?: string;

  @OneToMany(() => LeaderboardEntry, (entry) => entry.user)
  leaderboardEntries: LeaderboardEntry[];
}
