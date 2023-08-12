import { IsNotEmpty } from 'class-validator';

export class CreatePlatformDto {
  @IsNotEmpty()
  platforms: PlatformInterface[];
}

interface PlatformInterface {
  id: string;
  title: string;
  link: string;
  isLinkValid: string;
}
