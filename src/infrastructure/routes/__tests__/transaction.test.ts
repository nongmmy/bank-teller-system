import request from 'supertest';

import { app } from '../../../server';
import { myDataSource } from '../../config/typeorm.config';
import { AccountEntity } from '../../entities/account.entity';
import { UserEntity } from '../../entities/user.entity';
import { CustomerEntity } from '../../entities/customer.entity';

describe('Transaction routes (Integration)', () => {

  let authToken: string;

  beforeAll(async () => {

    process.env.NODE_ENV = 'test';

    if (!myDataSource.isInitialized) {
      await myDataSource.initialize();
    }

    // 1) Register a test user
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass', role: 'ADMIN' });

    // 2) Log in to get a token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(registerRes.status).toBe(200);
    expect(loginRes.status).toBe(200);

    authToken = loginRes.body.token;


  });

  afterAll(async () => {
    if (myDataSource.isInitialized) {
      await myDataSource.dropDatabase();
      await myDataSource.destroy();
    }
  });

  it('flow -> deposit balance', async () => {
    const createAccRes = await request(app)
      .post('/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'testFirstName', lastName: 'testLastName', telephone: '0812345678' });

    const accountId = createAccRes.body.newAccount.accountId;

    const res = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId,
        amount: 100
      });

    expect(res.body.account.accountId).toBe(accountId);
    expect(res.body.account.balance).toBe(100);
  });

  it('flow -> deposit to some account then transfer to two accounts', async () => {

    // 1) Create two more account
    const createAccARes = await request(app)
      .post('/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'AccountA', lastName: 'testLastName', telephone: '0812345678' });

    const createAccBRes = await request(app)
      .post('/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'AccountB', lastName: 'testLastName', telephone: '0812345678' });

    const createAccCRes = await request(app)
      .post('/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'AccountC', lastName: 'testLastName', telephone: '0812345678' });


    const accountIdA = createAccARes.body.newAccount.accountId;
    const accountIdB = createAccBRes.body.newAccount.accountId;
    const accountIdC = createAccCRes.body.newAccount.accountId;


    // 2) Deposit 1000 to account: A 
    const depositARes = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId: accountIdA,
        amount: 1000
      });

    expect(depositARes.body.account.accountId).toBe(accountIdA);
    expect(depositARes.body.account.balance).toBe(1000);

    // 3) Transfer 100 from Account: A -> account: B
    const transferToBRes = await request(app)
      .post('/transfer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        fromAccountId: accountIdA,
        toAccountId: accountIdB,
        amount: 100
      });

    expect(transferToBRes.body.fromAccount.accountId).toBe(accountIdA);
    expect(transferToBRes.body.fromAccount.balance).toBe(900);
    expect(transferToBRes.body.toAccount.accountId).toBe(accountIdB);
    expect(transferToBRes.body.toAccount.balance).toBe(100);

    // 4) Transfer 200 from Account: A -> account: C
    const transferToCRes = await request(app)
      .post('/transfer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        fromAccountId: accountIdA,
        toAccountId: accountIdC,
        amount: 200
      });

    expect(transferToCRes.body.fromAccount.accountId).toBe(accountIdA);
    expect(transferToCRes.body.fromAccount.balance).toBe(700);
    expect(transferToCRes.body.toAccount.accountId).toBe(accountIdC);
    expect(transferToCRes.body.toAccount.balance).toBe(200);

  });

  it('flow -> deposit error because of account not found', async () => {
    const accountId = 'no-acc';

    const res = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId,
        amount: 100
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe(`Account with ID ${accountId} does not exist.`);

  });

  it('flow -> deposit error because amount should be a number', async () => {
    const accountId = 'no-acc';

    const res = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId,
        amount: "aa"
      });

    console.log(res.body.errors);

    expect(res.status).toBe(400);
    expect(res.body.errors).toContainEqual('amount must be a positive number');

  });

  it('flow -> deposit into some account and withdraw it', async () => {
    const createAccRes = await request(app)
      .post('/account')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'testFirstName', lastName: 'testLastName', telephone: '0812345678' });

    const accountId = createAccRes.body.newAccount.accountId;

    const depositRes = await request(app)
      .post('/deposit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId,
        amount: 200
      });

    const withdrawRes = await request(app)
      .post('/withdraw')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        accountId,
        amount: 50
      });

    expect(withdrawRes.body.account.accountId).toBe(accountId);
    expect(withdrawRes.body.account.balance).toBe(150);
  });
});