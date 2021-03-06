// requires
const express = require( 'express' );
const router = express.Router();
const pool = require( './pool' );
// routes

router.delete( '/:id', ( req, res )=>{
  console.log( 'in /list DELETE:', req.params.id );
  let queryString = `DELETE FROM todo_list
      WHERE id = $1;`;
  pool.query( queryString, [ req.params.id ] ).then( ( result )=>{
          res.sendStatus( 201 );
      }).catch( ( err )=>{
          console.log( err );
          res.sendStatus( 500 );
      }) //end query
})

router.get( '/', ( req, res )=>{
    console.log( '/list GET' );
    /// - query: SELECT * FROM "todo_list" - ///
    let queryString = `SELECT * FROM "todo_list" ORDER BY "completed" ASC`;
    pool.query( queryString ).then( ( result )=>{
        // success
        res.send( result.rows );
    }).catch( ( err )=>{
        // error
        res.sendStatus( 500 );
    })
}) // end /list GET

router.post( '/', ( req, res )=>{
    console.log( 'in /list POST:', req.body.task );
    let queryString = `INSERT INTO todo_list (task, completed)
        VALUES ( $1 , FALSE)`;
    pool.query( queryString, 
        [ req.body.task ] ).then( ( result )=>{
            res.sendStatus( 201 );
        }).catch( ( err )=>{
            console.log( err );
            res.sendStatus( 500 );
        }) //end query
}) // end /list POST

router.put( '/toggle-completed/:id', ( req, res )=>{
  console.log( 'in /list/toggle-completed PUT:', req.params.id );
  let queryString =   `UPDATE todo_list
                      SET completed = NOT completed
                      WHERE id = $1;`;
  pool.query( queryString, [ req.params.id ] ).then( ( result )=>{
          res.sendStatus( 201 );
      }).catch( ( err )=>{
          console.log( err );
          res.sendStatus( 500 );
      }) //end query
})

router.put( '/update-text/:id', ( req, res )=>{
  console.log( 'in /list/update-text PUT:', req.body.newText, req.params.id );
  let queryString =   `UPDATE todo_list
                      SET task = $1
                      WHERE id = $2;`;
  pool.query( queryString, [ req.body.newText, req.params.id ] ).then( ( result )=>{
          res.sendStatus( 201 );
      }).catch( ( err )=>{
          console.log( err );
          res.sendStatus( 500 );
      }) //end query
})
// export
module.exports = router;