import { INestApplication } from '@nestjs/common';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import * as request from 'supertest';
import { Contact } from '@prisma/client';

describe('ContactController', () => {
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
          phone: '08123456789',
        });

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

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.first_name).toEqual('test');
      expect(response.body.data.last_name).toEqual('test');
      expect(response.body.data.phone).toEqual('08123456789');
      expect(response.body.data.email).toEqual('test@gmail.com');
    });
  });
  
  describe('GET /api/contact/:id', () => {
    let token: string;
    let contact: Contact;

    beforeAll(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createDummyUser();

      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      token = response.body.data.token;
      contact = await testService.createContact();
    });

    afterAll(async () => {
      await testService.deleteDummyUser();
      await testService.deleteAll();
    });

    it('Should thorw error if authentiaction invalid', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/contact/${contact.id}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('Should throw error when id not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contact/0`)
        .set('Authorization', `${token}`)

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('Should throw error when user owner not match with database', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'testing',
          password: 'testtest',
        });

      const response = await request(app.getHttpServer())
        .get(`/api/contact/${contact.id}`)
        .set('Authorization', `${user.body.data.token}`)

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to get contact', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contact/${contact.id}`)
        .set('Authorization', `${token}`)

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.first_name).toEqual('test');
      expect(response.body.data.last_name).toEqual('test');
      expect(response.body.data.phone).toEqual('08123456789');
      expect(response.body.data.email).toEqual('test@gmail.com');
    });
  });

  describe('PATCH /api/contact/:id', () => {
    let token: string;
    let contact: Contact;

    beforeAll(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createDummyUser();

      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'testtest',
        });

      token = response.body.data.token;
      contact = await testService.createContact();
    });

    afterAll(async () => {
      await testService.deleteDummyUser();
      await testService.deleteAll();
    });

    it('Should thorw error if authentiaction invalid', async () => {
      const response = await request(app.getHttpServer()).patch(
        `/api/contact/${contact.id}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('Should throw error when invalid body request', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${contact.id}`)
        .set('Authorization', `${token}`)
        .send({
          last_name: 'te',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('Should throw error when id not found', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/contact/0`)
        .set('Authorization', `${token}`)
        .send({
          last_name: 'test',
        });

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('Should throw error when user owner not match with database', async () => {
      const user = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'testing',
          password: 'testtest',
        });

      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${contact.id}`)
        .set('Authorization', `${user.body.data.token}`)
        .send({
          last_name: 'test',
        });

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to edit contact', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${contact.id}`)
        .set('Authorization', `${token}`)
        .send({
          last_name: 'testing',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.first_name).toEqual('test');
      expect(response.body.data.last_name).toEqual('testing');
      expect(response.body.data.phone).toEqual('08123456789');
      expect(response.body.data.email).toEqual('test@gmail.com');
    });
  });
});
