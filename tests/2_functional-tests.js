/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let test1_id;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        let testData = { title: "The Final Empire" };

        chai.request(server)
          .post('/api/books')
          .send(testData)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, testData.title, 'Created book should have the title that was sent');
            assert.property(res.body, '_id', 'Created book should have an _id');
            test1_id = res.body._id;
            done()
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        let testData = {};

        chai.request(server)
          .post('/api/books')
          .send(testData)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title', 'response should fail and state the missing field');
            done()
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let test_id = '66fda36df788c4001399af0d'

        chai.request(server)
          .get('/api/books/' + test_id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', "Response should mention book doesn't exist");
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + test1_id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body._id, test1_id, 'Existing book should have queried _id');
            assert.equal(res.body.title, "The Final Empire", 'Existing book should have expected title');
            assert.property(res.body, 'comments', 'Existing book should have comments property');
            assert.isArray(res.body.comments, 'Comments property should be an array');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let testData = { comment: "Good book" }

        chai.request(server)
          .post('/api/books/' + test1_id)
          .send(testData)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body._id, test1_id, 'Existing book should have queried _id');
            assert.equal(res.body.title, "The Final Empire", 'Existing book should have expected title');
            assert.equal(res.body.comments[0], testData.comment, 'Book should have passed comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let testData = {}

        chai.request(server)
          .post('/api/books/' + test1_id)
          .send(testData)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment', 'Response should mention missing comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let testData = { comment: "Good book" }

        chai.request(server)
          .post('/api/books/' + "66fda36df788c4001399af0d")
          .send(testData)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'Response should mention failing to find book');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){

        chai.request(server)
          .delete('/api/books/' + test1_id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful', 'Response should mention delete was successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){

        chai.request(server)
          .delete('/api/books/' + "66fda36df788c4001399af0d")
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'Response should mention failing to find book');
            done();
          });
      });

    });

  });

});
