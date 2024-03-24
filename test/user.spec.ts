import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/user/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    })

    it('Should be reject if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test',
          password: 'testtest',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to register user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test',
          password: 'testtest',
          name: 'test',
        })

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });

    it('Should be reject if username is already taken', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test',
          password: 'testtest',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })
  });
});
