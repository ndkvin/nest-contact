import { INestApplication } from '@nestjs/common';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as request from 'supertest';

describe('ContactController', () => {
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

  describe('POST /api/contact', () => {
    let token: string;

    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      token = response.body.data.token;
    });

    it('Should thorw error if authentiaction invalid', async () => {
      const response = await request(app.getHttpServer()).post('/api/contact');

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('Should throw error when invalid body request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contact')
        .set('Authorization', `${token}`)
        .send({
          first_name: 'test',
          last_name: 'test',
          phone: '08123456789'
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contact')
        .set('Authorization', `${token}`)
        .send({
          first_name: 'test',
          last_name: 'test',
          phone: '08123456789',
          email: 'test@gmail.com',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.first_name).toEqual('test');
      expect(response.body.data.last_name).toEqual('test');
      expect(response.body.data.phone).toEqual('08123456789');
      expect(response.body.data.email).toEqual('test@gmail.com');
    });
  });
});
