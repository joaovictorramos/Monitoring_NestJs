import { Test, TestingModule } from '@nestjs/testing';
import { MatterService } from './matter.service';

describe('MatterService', () => {
  let service: MatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatterService],
    }).compile();

    service = module.get<MatterService>(MatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
