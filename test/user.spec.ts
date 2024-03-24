import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /api/user/register', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it('Should be reject if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test',
          password: 'testtest',
          name: '',
        });


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
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
        });


      expect(response.status).toBe(201);
      expect(response.body.data.username).toEqual('test');
      expect(response.body.data.name).toEqual('test');
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('Should be reject if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
        });


      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be reject if user is not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test2',
          password: 'testtest',
        });


      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be reject if password is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest2',
        });


      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });


      expect(response.status).toBe(200);
      expect(response.body.data.username).toEqual('test');
      expect(response.body.data.name).toEqual('test');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/user/current', () => {
    beforeAll(async () => {
      await testService.deleteAll();
      await testService.createUser();
    })

    it('should be reject if token is not send', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/user/current',
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be reject if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user/current')
        .set('Authorization', 'wrongtoken');

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get current user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      const user = res.body.data;

      const response = await request(app.getHttpServer())
        .get('/api/user/current')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toEqual('test');
      expect(response.body.data.name).toEqual('test');
    })
  });

  describe('DELETE /api/user/current', () => {
    beforeAll(async () => {
      await testService.deleteAll();
      await testService.createUser();
    })

    it('should be reject if token is not send', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/user/current',
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be reject if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/user/current')
        .set('Authorization', 'wrongtoken');

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get current user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      const user = res.body.data;

      const response = await request(app.getHttpServer())
        .delete('/api/user/current')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(true);
    })
  });

  describe('PATCH /api/user/current', () => {
    beforeAll(async () => {
      await testService.deleteAll();
      await testService.createUser();
    })

    it('should be reject if token is not send', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/user/current',
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be reject if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current')
        .set('Authorization', 'wrongtoken');

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should throw error when validation error', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      const user = res.body.data;

      const response = await request(app.getHttpServer())
        .patch('/api/user/current')
        .send({
          name: "1"
        })
        .set('Authorization', user.token);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get current user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      const user = res.body.data;

      const response = await request(app.getHttpServer())
        .patch('/api/user/current')
        .send({
          name: "Budi"
        })
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual("Budi");
    })
  });
});
