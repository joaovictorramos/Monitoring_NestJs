import { Test, TestingModule } from '@nestjs/testing';
import { MatterController } from './matter.controller';
import { MatterService } from './matter.service';

describe('MatterController', () => {
  let controller: MatterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatterController],
      providers: [MatterService],
    }).compile();

    controller = module.get<MatterController>(MatterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
