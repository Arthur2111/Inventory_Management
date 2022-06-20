const mysql = require('mysql');
const express= require('express');
const session = require('express-session');
const app= express();
const path = require('path');

//Connection to Login Pool
const connection= mysql.createConnection({
    host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'nodelogin'
})


app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//view login page
exports.login = (req, res) => {
    res.render('login')
};



//Connection Pool - cache of database connection so that connection can be reused 
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


//view home page
exports.view = (req, res) => {
    //connects to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);

        //Use the connection
        connection.query('SELECT * FROM user WHERE status ="active"', (err, rows) => {
            // When done with the connectiom , release it
            connection.release();

            if (!err) {
                res.render('home', { rows });
            } else {
                console.log('something went wrong Flag1' + err);
            }

            console.log('The data from user table: \n', rows);
        })
    });
};



//search for users
exports.search = (req, res) => {
    //connects to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);

        //take from search box
        let searchTerm = req.body.search;


        //Use the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name  LIKE ? OR email  LIKE  ?', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            // When done with the connectiom , release it
            connection.release();

            if (!err) {
                res.render('home', { rows });
            } else {
                console.log('something went wrong Flag1: ' + err);
            }

            console.log('The data from user table: \n', rows);
        })
    });
}



// render the add user page (.get)
exports.add = (req, res) => {
    res.render('add-user');
}

//add new users app.post to create a new user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    //connects to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);

        //take from search box
        let searchTerm = req.body.search;


        //Use the connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
            // When done with the connectiom , release it
            connection.release();

            if (!err) {
                res.render('add-user', { alert: 'User added successfully!' });
            } else {
                res.render('add-user', { error: 'User added unsuccessfully!' });
            }

            console.log('The data from user table: \n', rows);
        })
    });
}


// Edit User page
exports.edit = (req, res) => {
    //connects to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);

        //Use the connection
        connection.query('SELECT * FROM user WHERE ID = ?', [req.params.id], (err, rows) => {
            // When done with the connectiom , release it
            connection.release();

            if (!err) {
                res.render('edit-user', { rows });
            } else {
                console.log('something went wrong Flag1' + err);
            }

            console.log('The data from user table: \n', rows);
        })
    });
}

// Update User
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    //connects to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);
        //Use the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            // When done with the connectiom , release it
            connection.release();
            if (!err) {
                //connects to DB
                pool.getConnection((err, connection) => {
                    if (err) throw err; //not able to connect to DB
                    console.log("Connected To Database as ID" + connection.threadId);
                    //Use the connection
                    connection.query('SELECT * FROM user WHERE ID = ?', [req.params.id], (err, rows) => {
                        // When done with the connectiom , release it
                        connection.release();
                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
                        } else {
                            console.log('something went wrong Flag1' + err);
                        }
                        console.log('The data from user table: \n', rows);
                    })
                });
            } else {
                console.log('something went wrong Flag1' + err);
            }
            console.log('The data from user table: \n', rows);
        })
    });
}


//Delete User
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {     //connects to DB
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);
        //Use the connection
        connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
            if (!err) {
                let removedUser = encodeURIComponent('User successeflly removed.');
                res.redirect('/?removed=' + removedUser);
            } else {
                console.log(err);
            }
            console.log('The data from beer table are: \n', rows);
        })
    });
}


//view Users
exports.viewall = (req, res) => {
    //connects to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not able to connect to DB
        console.log("Connected To Database as ID" + connection.threadId);

        //Use the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            // When done with the connectiom , release it
            connection.release();

            if (!err) {
                res.render('view-user', { rows });
            } else {
                console.log('something went wrong Flag1' + err);
            }

            console.log('The data from user table: \n', rows);
        })
    });
};




