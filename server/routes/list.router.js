// requires
const express = require( 'express' );
const router = express.Router();
const pool = require( './pool' );
// routes

router.delete( '/:id', ( req, res )=>{
  console.log( 'in /koalas DELETE:', req.params.id );
  let queryString = `DELETE FROM koala_holla
      WHERE id = $1;`;
  pool.query( queryString, [ req.params.id ] ).then( ( result )=>{
          res.sendStatus( 201 );
      }).catch( ( err )=>{
          console.log( err );
          res.sendStatus( 500 );
      }) //end query
})

router.get( '/', ( req, res )=>{
    console.log( '/koalas GET' );
    /// - query: SELECT * FROM "koals_holla" - ///
    let queryString = `SELECT * FROM "koala_holla" ORDER BY "id" ASC`;
    pool.query( queryString ).then( ( result )=>{
        // success
        res.send( result.rows );
    }).catch( ( err )=>{
        // error
        res.sendStatus( 500 );
    })
}) // end /koalas GET

router.post( '/', ( req, res )=>{
    console.log( 'in /koalas POST:', req.body );
    let queryString = `INSERT INTO koala_holla ("name", gender, age, ready_for_transfer, notes)
        VALUES ( $1, $2, $3, $4, $5 )`;
    pool.query( queryString, 
        [ req.body.name, req.body.gender , req.body.age, req.body.ready_for_transfer, req.body.notes ] ).then( ( result )=>{
            res.sendStatus( 201 );
        }).catch( ( err )=>{
            console.log( err );
            res.sendStatus( 500 );
        }) //end query
}) // end /koalas POST

router.put( '/toggle-ready/:id', ( req, res )=>{
  console.log( 'in /koalas PUT:', req.params.id );
  let queryString =   `UPDATE koala_holla
                      SET ready_for_transfer = NOT ready_for_transfer
                      WHERE id = $1;`;
  pool.query( queryString, [ req.params.id ] ).then( ( result )=>{
          res.sendStatus( 201 );
      }).catch( ( err )=>{
          console.log( err );
          res.sendStatus( 500 );
      }) //end query
})

// export
module.exports = router;