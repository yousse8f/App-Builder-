export class CreateProjectScreenDto {
  name: string;
  order: number;
  config: Record<string, any>;
  deviceId?: string;
  metadata?: any;
}
