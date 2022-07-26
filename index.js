import express from "express"
const app = express()
const port = 3001
import { initDBConnection } from './database.js'

app.use(express.json())
const connection = initDBConnection()

app.head('/api/getHead', (req, res) => {
  res.set('name', 'Spider-man')
})

app.get('/api/getBookByID', (req, res) => {
  connection.query('select * from book', function (error, results, fields) {
    if (error) throw error;
    // Set a response header [name].
    res.set('name', 'Spider-man')
    res.json(results)
  });
})

app.put('/api/modifyBookInfo', (req, res) => {
  console.log("++++req", req.body)
  connection.beginTransaction(error => {
    if (error) {
      throw error
    }
    connection.query('delete from book where BookID = ?', [req.body.bookID], function (error, results, fields) {
      if (error) {
        return connection.rollback(() => { throw error })
      }
      connection.query('insert into Book values (? , ? , ?, ?, ?)', [
        req.body.bookID,
        req.body.bookName,
        req.body.author,
        req.body.shelfID,
        req.body.city
      ], function(error, results, fields) {
        if (error) {
          return connection.rollback(() => { throw error })
        }
        connection.commit(error => {
          if (error) {
            return connection.rollback(() => { throw error })
          }
        })
        res.json(results)
      })
    });
  })
})

app.patch('/api/modifyPartialBookInfo', (req, res) => {
  console.log("++++++++++++++req", req.body)
  connection.beginTransaction(error => {
    if (error) {
      throw error
    }
    connection.query('select * from book where bookID = ?', [req.body.bookID], function (error, results, fields) {
      if (error) throw error;
      const backupData = results[0]
      connection.query('update Book set bookName = ?, author = ?, shelfID = ?, city = ? where bookID = ?', [
        req.body.bookName ? req.body.bookName : backupData.BookName,
        req.body.author ? req.body.author : backupData.Author,
        req.body.shelfID ? req.body.shelfID : backupData.ShelfID,
        req.body.city ? req.body.city : backupData.City,
        req.body.bookID
      ], function(error, results, fields) {
        if (error) {
          return connection.rollback(() => { throw error })
        }
        connection.commit(error => {
          if (error) {
            return connection.rollback(() => { throw error })
          }
        })
        res.json(results)
      })
    });
  })
})

app.delete('/api/deleteBookByID', (req, res) => {
  console.log("++++++++req", req.body)
  connection.beginTransaction(error => {
      if (error) {
        throw error
      }
    connection.query('delete from Book where bookID = ?', [
      req.body.bookID
    ], function(error, results, fields) {
      if (error) {
        return connection.rollback(() => { throw error })
      }
      connection.commit(error => {
        if (error) {
          return connection.rollback(() => { throw error })
        }
      })
      res.json(results)
    })
  })
})

app.post('/api/addBook', (req, res) => {
  console.log("++++++++req", req.body)
  connection.beginTransaction(error => {
    if (error) {
      throw error
    }
    connection.query('insert into Book select max(bookId)+1 , ? , ?, ?, ? from Book', [
      req.body.bookName,
      req.body.author,
      req.body.shelfID,
      req.body.city,
    ], function(error, results, fields) {
      if (error) {
        return connection.rollback(() => { throw error })
      }
      connection.commit(error => {
        if (error) {
          return connection.rollback(() => { throw error })
        }
      })
      res.json(results)
    })
  })
})

app.post('/post_test', (req, res) => {
  res.send('Test post')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
