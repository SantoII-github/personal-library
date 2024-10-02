/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], required: true }
});

const Book = new mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let booksArray = await Book.find({});

      let formattedBooks = booksArray.map(book => {
        return {
          title: book.title,
          _id: book._id,
          commentcount: book.comments.length
        }
      })

      res.json(formattedBooks);
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send('missing required field title');
        return;
      }

      let newBook = new Book({ title });
      newBook.save();
      res.json({title, _id: newBook._id})
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'

      let deleteOutput = await Book.deleteMany({});
      if (deleteOutput) {
        res.send('complete delete successful');
      } else {
        res.sen('complete delete unsuccessful');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      let book = await Book.findById(bookid).select('-__v');
      if (!book) {
        res.send('no book exists');
        return;
      }

      res.json(book);
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        res.send('missing required field comment');
        return;
      }

      let book = await Book.findById(bookid).select('-__v');
      if (!book) {
        res.send('no book exists');
        return;
      }

      book.comments.push(comment);
      book.save();

      res.json(book);
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      let deleteOutput = await Book.findByIdAndDelete(bookid);

      if (!deleteOutput) {
        res.send('no book exists');
      } else {
        res.send('delete successful');
      }
    });
  
};
