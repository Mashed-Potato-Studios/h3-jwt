// test/jwtMiddleware.test.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import jwt from 'jsonwebtoken';
import jwtMiddleware from '../src/middleware/jwtMiddleware';

chai.use(chaiHttp);
const { expect } = chai;
const SECRET = 'test-secret';

const app = express();

app.use('/protected', jwtMiddleware({ secret: SECRET }));
app.get('/protected', (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});

describe('JWT Middleware', () => {
  it('should return 401 when no token is provided', (done) => {
    chai.request(app)
      .get('/protected')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.equal('No token provided');
        done();
      });
  });

  it('should return 401 when an invalid token is provided', (done) => {
    chai.request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken123')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.text).to.equal('Invalid token');
        done();
      });
  });

  it('should grant access when a valid token is provided', (done) => {
    const validToken = jwt.sign({ name: 'John' }, SECRET, { expiresIn: '1h' });

    chai.request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello, John');
        done();
      });
  });
});

