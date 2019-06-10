var express = require('express');
var passwordHash = require('password-hash');
var Recaptcha = require('express-recaptcha').RecaptchaV2;
var sql = require('../sql/db.js');

var router = express.Router();

//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha('', '');

const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


/* GET users listing. */
router.post('/:page', recaptcha.middleware.verify, function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (req.params.page === "signup") {
        if (req.session.loggedin) {
            return res.send(404);
            
        }
        if (!req.body.email || !req.body.name || !req.body.passwd || !req.body.cpasswd) {
            return res.end(JSON.stringify({ status: "Missing infos." }));
        }
        if (req.app.get('env') !== 'development' && (!req.body.captcha || req.recaptcha.error)) {
            return res.end(JSON.stringify({ status: "Please check the recaptcha." }));
        }

        if (!req.body.service || req.body.service !== 'on') {
            return res.end(JSON.stringify({ status: "You need to accept the terms of services to register a new account." }));
        }

        sql.query("SELECT * FROM users WHERE email=?", [
            req.body.email
        ], function(error, results, field) {

            if (!error) {
                if (results.length) {
                    return res.end(JSON.stringify({ status: "Email already exist." }));
                }

                if (req.body.email.length > 65 || req.body.email.length <= 0 || !re.test(req.body.email)) {
                    return res.end(JSON.stringify({ status: "Invalid email." }));
                }
                if (req.body.name > 42 || req.body.name <= 0) {
                    return res.end(JSON.stringify({ status: "Invalid username." }));
                }

                if (req.body.passwd !== req.body.cpasswd || req.body.passwd.length < 8 || req.body.passwd > 300) {
                    return res.end(JSON.stringify({ status: "Invalid Password." }));
                } // insertId
                sql.query("INSERT INTO users (username, email, passwd, add_at, last_visit) VALUES (?, ?, ?, NOW(), NOW())", [
                    req.body.name,
                    req.body.email,
                    passwordHash.generate(req.body.passwd) // passwordHash.verify(password, hash_password);
                ], function(error, resul, field) {
                    if (!error) {
                        sql.query("SELECT * FROM users WHERE id=?", [resul.insertId], function(error, resu, field) {
                            if (!error) {
                                resu = resu[0]
                                req.session.loggedin = true;
                                req.session.username = resu.username;
                                req.session.email = resu.email;
                                req.session.user_id = resu.id;
                                return res.end(JSON.stringify({ status: "success", results: JSON.stringify(resu) }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong1!"+error }));
                            }

                        })
                    } else {
                        return res.end(JSON.stringify({ status: "Something went wrong!"+error }));
                    }
                });


            }

            else {
                return res.send('something went wrong\n' + error);
            }
            
        }); 


    } else if (req.params.page === "login") {
        if (req.session.loggedin) {
            return res.send(404);
        }

        if (!req.body.email || !req.body.passwd) {
            return res.end(JSON.stringify({ status: "Missing infos." }));
        }

        if (req.body.email.length < 0 || req.body.email.length > 65 || !re.test(req.body.email)) {
            return res.end(JSON.stringify({ status: "Invalid email." }));
        }
        sql.query("SELECT * FROM users WHERE email=?", [
            req.body.email
        ], function (error, results, field) {
            if (!error) {
                if (results.length <= 0) {
                    return res.end(JSON.stringify({ status: "Email doesn't exist." }));
                }
                var result = results[0]
                if (passwordHash.verify(req.body.passwd, result.passwd)) {
                    sql.query("UPDATE users SET last_visit=NOW() WHERE email=?;select last_insert_id();", [
                        req.body.email
                    ], function () {
                        req.session.loggedin = true;
                        req.session.username = result.username;
                        req.session.email = result.email;
                        req.session.user_id = result.id;
                        return res.end(JSON.stringify({ status: "success" }));
                    });
                } else {
                    return res.end(JSON.stringify({ status: "Wrong password" }));
                }
            } else {
                return res.end(JSON.stringify({ status: "Something went wrong!" }));
            }

        });
        


    } else {
        return res.end(JSON.stringify({ status: "" }));
    }
  });

  module.exports = router;
