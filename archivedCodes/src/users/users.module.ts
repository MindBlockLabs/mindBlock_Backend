import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './providers/users.service';
import { UsersController } from './controllers/users.controller';
import { FindOneByEmail } from './providers/find-one-by-email.provider';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserService } from './providers/create-user.service';
import { DeleteUserService } from './providers/delete-user.service';
import { FindAll } from './providers/find-all.service';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-googleId';
import { CreateGoogleUserProvider } from './providers/googleUserProvider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { FindOneByWallet } from './providers/find-one-by-wallet.provider';
import { UpdateUserService } from './providers/update-user.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    PaginationModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserService,
    FindOneByEmail,
    FindOneByWallet,
    FindAll,
    DeleteUserService,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider,
    UpdateUserService
  ],
  exports: [UsersService], // Make service reusable
})
@Module({})
export class UsersModule {}
