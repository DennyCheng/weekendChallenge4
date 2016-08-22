var express = require('express');
var router = express.Router();
var pg = require('pg');
//we use pg package to make requests to our quarries(postgres)
var connectionString = 'postgres://localhost:5432/omicron';

router.post('/',function(req,res){
  var task = req.body;
  console.log('request reached',task);
  console.log("reached");

  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
      res.sendStatus(500);
    };
    client.query('INSERT INTO tasks(task,status)'
      +'VALUES($1,$2)',
      [task.task,task.status],
        function(err,result){
          done();
          if (err){
            console.log(err);
            res.sendStatus(500);
          }
          else{res.sendStatus(201);
        }
        });
  });
});

router.get('/', function (req, res) {
  // Retrieve books from database
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('SELECT * FROM tasks;', function (err, result) {
      done(); // closes connection, I only have 10!

      if (err) {
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});


router.put('/:id', function(req,res){
  var id = req.params.id;
  //getting the ID off the request params.id which comes from the URL
  var task = req.body;
  task.status = ("complete");
  console.log(task);

  pg.connect(connectionString, function(err,client,done){
    if(err){
      res.sendStatus(500);
    }

    client.query('UPDATE tasks SET status = $1 WHERE id = $2',
                  //tell it specifically which ID to update or it will update everything
                  ['complete',task.id],
                  //this pairs up with our $1,$2 etc.)
                  //id represents the variable id (NOT book.id since that property doesn't exist)
                  function(err,result){
                    done();
                    //to close our connection to server
                  //the result of the request
                  if(err){
                    console.log('err',err);
                    res.sendStatus(500);
                  } else{
                    res.sendStatus(200);
                  }
                });
  });
});

router.delete('/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
  //this id is paired with '/:id' in the parameter
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    client.query('DELETE FROM tasks ' +
                'WHERE id = $1',
                [id],
                function(err,result){
                  done();

                  if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                  }
                  res.sendStatus(200);
                });
  });
});
module.exports = router;
