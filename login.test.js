const request = require('supertest');

const api = request('https://reqres.in');
const path = '/api/login';

const validCredential = {
  'email': 'eve.holt@reqres.in',
  'password': 'test123'
}

const invalidCredential = [
  ['invalid email or username', 'test@gmail.com', 'cityslicka', 'user not found'],
  ['missing password', 'eve.holt@reqres.in', '', 'Missing password'],
  ['missing email or username', '', 'cityslicka','Missing email or username']
];

function signIn(credential) {
  return api.post(path)
    .send(credential)
}

test('Positive test - complete request body', async () => {
  const response = await signIn(validCredential);
  expect(response.status).toEqual(200);
  expect(response.body).toHaveProperty('token');
  expect(response.body.token).not.toBeNull();
})

test.each(invalidCredential)('Negative test - %s', async (title, email, password, errorMessage) => {
  const response = await signIn({'email': email, 'password': password});
  expect(response.status).toEqual(400);
  expect(response.body).toHaveProperty('error', errorMessage);
})
