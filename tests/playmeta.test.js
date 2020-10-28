const request = require('supertest');
const app = require('../app');

describe('Test GET /playmeta/:link', () => {
    it('should return convert status', (done) => {
        request(app)
            .get('/playmeta/zJCdkOpU90g')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjczOWVlZDEwLTEyYzMtMTFlYi04M2QzLTNiZGFjOGY1NDUyNSIsImF1dGgiOiJodHRwOi8vYXBpLmRhaWx5YmFuanUuY29tIiwiaWF0IjoxNjAzODU3MDAzfQ.tUO18dfaL5gHLMKtIyWPgOX3S_ARazFXOPDyqNkjpvw')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});