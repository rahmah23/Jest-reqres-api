//Pemanggilan module supertest (modul yang khusus untuk mengetest server HTTP)
const request = require('supertest');

//Deklarasi variabel yang menyimpan http server
const api = request('https://reqres.in');
//Deklarasi variabel yang menyimpan path endpoint
const path = '/api/login';

//Deklarasi variabel json yang berisi username dan password yang valid
const validCredential = {'email': 'eve.holt@reqres.in', 'password': 'test123'}

//Deklarasi variabel yang berisi array 2 dimensi yang berisi data invalid untuk test
const invalidCredential = [
  ['invalid email or username', 'test@gmail.com', 'cityslicka', 'user not found'],
  ['missing password', 'eve.holt@reqres.in', '', 'Missing password'],
  ['missing email or username', '', 'cityslicka','Missing email or username']
];

//Membuat fungsi untuk membuat request ke endpoint Login
function logIn(credential) {
  //Fungsi mengembalikan request ke endpoint login server http://reqres.in dengan method post
  return api.post(path)
    //Mengirim request body dalam bentuk json
    .send(credential)
}

//Script test untuk skenario success request (positive test)
test('Positive test - complete request body', async () => {
  //Memanggil fungsi logIn untuk request ke endpoint Login dengan data yang valid dan menyimpan responsenya
  const response = await logIn(validCredential);
  //Matcher untuk membandingkan expected value dengan status code yang didapatkan response
  expect(response.status).toEqual(200);
  //Matcher untuk memverifikasi di dalam body response yang didapatkan terdapat property 'token'
  expect(response.body).toHaveProperty('token');
  //Matcher untuk memverifikasi value property 'token' tidak kosong
  expect(response.body.token.length).toBeGreaterThan(1);
})

//Script test untuk skenario failed request (negative test)
test.each(invalidCredential)('Negative test - %s', async (title, email, password, errorMessage) => {
  //Memanggil fungsi logIn untuk request ke endpoint Login dengan data yang tidak valid dan menyimpan responsenya
  const response = await logIn({'email': email, 'password': password});
  //Matcher untuk membandingkan expected value dengan status code yang didapatkan response
  expect(response.status).toEqual(400);
  //Matcher untuk memverifikasi di dalam body response yang didapatkan terdapat property 'error' yang valuenya sesuai dengan expected value
  expect(response.body).toHaveProperty('error', errorMessage);
})
