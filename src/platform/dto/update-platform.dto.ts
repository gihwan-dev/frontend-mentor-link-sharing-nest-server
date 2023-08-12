import { IsNotEmpty } from 'class-validator';

export class UpdatePlatformDto {
  @IsNotEmpty()
  platforms: PlatformInterface[];
}

interface PlatformInterface {
  id: string;
  title: string;
  link: string;
  isLinkValid: string;
}
