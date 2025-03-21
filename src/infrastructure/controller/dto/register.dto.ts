import { IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(['ADMIN', 'USER'])
  role: string;
}
