import request from 'supertest';
import app from '../src/app';

describe('Identity Module', () => {
  it('should register a new user and organization', async () => {
    const res = await request(app)
      .post('/api/v1/identity/register')
      .send({
        email: 'testuser@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User'
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('organizationId');
  });

  it('should login with registered user', async () => {
    const res = await request(app)
      .post('/api/v1/identity/login')
      .send({
        email: 'testuser@example.com',
        password: 'TestPass123!'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('testuser@example.com');
  });
});
