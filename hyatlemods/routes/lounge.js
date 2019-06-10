var express = require('express');
var sql = require('../sql/db.js');
var Recaptcha = require('express-recaptcha').RecaptchaV2;
const path = require('path');
const upload = require('../addons/uploadWired');
const Resize = require('../addons/resize');
var passwordHash = require('password-hash');
var router = express.Router();

//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha('6LdglZwUAAAAANHbFpxASnT2DSeNNlxXKThOx4ew', '6LdglZwUAAAAACoHaC6zJc6PddfilAbn0UYtvm7f');


router.post('/create/image', upload.single('mod_image'), async function (req, res) {
    if (req.session.loggedin) {
        const imagePath = path.join(__dirname, '/../public/images/mods_images');
        const fileUpload = new Resize(imagePath, 620, 340);
        if (!req.file) {
            return res.status(401).json({error: 'Please provide an image'});
        }
        const filename = await fileUpload.save(req.file.buffer);
        sql.query('SELECT id FROM mods WHERE owner_id=? ORDER BY id DESC LIMIT 1', [req.session.user_id], function (error, results, filed) {
            if (!error) {
                sql.query('SELECT * FROM images WHERE mod_id=?', [results[0].id], function (error, r, filed) { // TODO; change url
                    console.log(results)
                    if (!error) {
                        if (r.length < 10)
                        sql.query('INSERT INTO images (mod_id, mod_image, added_at) VALUES (?, ?, NOW())', [results[0].id, "https://hytale-mods.com/images/mods_images/"+filename], function (error, resul, filed) { // TODO; change url

                            if (!error) {
                                return res.end(JSON.stringify({ status: 'success', filename: "https://hytale-mods.com/images/mods_images/"+filename}));
                            } else {
                                return res.end(JSON.stringify({ status: 'Something Went wrong! 541' }));
                            }
                        });
                        else
                        return res.end(JSON.stringify({ status: 'you can\'t upload more than 10 images' }));
                    } else {
                        return res.end(JSON.stringify({ status: 'Something Went wrong! 541-S' }));
                    }
                })
            }
        })
    } else 
    return res.end(JSON.stringify({ status: "you're not logged in" }));
  });
// CREATE mods
router.post('/create', recaptcha.middleware.verify, function (req, res, next) {
    if (req.session.loggedin) {
        if (req.app.get('env') !== 'development' && (!req.body.captcha || req.recaptcha.error)) {
            return res.end(JSON.stringify({ status: "Please check the recaptcha." }));
        }
        if (!req.session.user_id) {
            return res.end(JSON.stringify({ status: "Something went wrong." }));
        } else if (!req.body.modname || req.body.modname.length > 45) {
            return res.end(JSON.stringify({ status: "Invalid Mod name." }));
        } else if (!req.body.mod_description || !/^[\],:{}\s]*$/.test(req.body.mod_description.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            return res.end(JSON.stringify({ status: "Invalid Description." }));
        } else if (!req.body.tags || req.body.tags.length > 1000) {   // fix this later TODO
            return res.end(JSON.stringify({ status: "Invalid tags." }));
        } else if (!req.body.maplink || req.body.maplink.length > 500) {
            return res.end(JSON.stringify({ status: "Invalid map link." }));
        } else if ([".zip", ".rar", ".7z", ".gz", ".tar", ".arg", ".tgz"].indexOf(path.extname(req.body.maplink)) < 0) {
            return res.end(JSON.stringify({ status: "Mod link should be a compressed file: zip, rar, 7z, gzn tar, arg, tgz." }));
        } else {
            var description = JSON.parse(req.body.mod_description)
            var new_description = {ops:[]};
            var images = []
            if (description.ops) {
                for (var i in description.ops) {
                    if (description.ops[i].insert) {
                        if (description.ops[i].insert.image) {
                            images.push(description.ops[i])
                            new_description.ops.push("put image here")
                        } else {
                            new_description.ops.push(description.ops[i])
                        }
                    } else {
                        new_description.ops.push(description.ops[i])
                    }
                }
            } else {
                return res.end(JSON.stringify({ status: "Invalid Description, Not supported" }));
            }
            console.log(new_description)
            sql.query('INSERT INTO mods (owner_id, modname, create_date, update_date, views, downloads, likes, comments, favorites, mod_description, tags, maplink) VALUES (?, ?, NOW(), NOW(), 0, 0, 0, 0, 0, ?, ?, ?)', [
                req.session.user_id,
                req.body.modname,
                JSON.stringify(new_description),
                req.body.tags,
                req.body.maplink
            ], function (error, results, filed) {
                if (!error) {
                    if (results) {
                        sql.query("INSERT INTO mod_desc_images (mod_id, d_image) VALUES (?, ?)", [results.insertId, JSON.stringify(images)], function (error, resu, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success", mod_id:results.insertId }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 221-2" }));
                            }
                        })
                    } else
                        return res.end(JSON.stringify({ status: "Mod added but without description images, something went wrong.", mod_id:results.insertId }));
                } else {
                    return res.end(JSON.stringify({ status: "Something went wrong! 221 "+error }));
                }
            });
        }
        
    } else {
        return res.send(404);
    }
});

// List a description images
router.get('/mods/description/images/:id', function (req, res, next) {
    sql.query('SELECT * FROM mod_desc_images WHERE mod_id=?', [req.params.id], function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 661" + error }));
        }
    });
});

// READ mods
router.get('/mods', function(req, res, next) {
    sql.query('SELECT *, (SELECT username from users where id=owner_id) as username, (SELECT user_image from users where id=owner_id) as user_image  FROM mods ORDER BY favorites DESC LIMIT 50', function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 222-1" }));
        }
    });
});


router.get('/mods/:id', function(req, res, next) {
    sql.query('SELECT *, (SELECT username from users where id=owner_id) as username, (SELECT user_image from users where id=owner_id) as user_image FROM mods WHERE id=?', [req.params.id], function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 222-2" + error }));
        }
    });
});
router.get('/mods/owner/:id', function(req, res, next) {
    sql.query('SELECT *, (SELECT username from users where id=owner_id) as username, (SELECT user_image from users where id=owner_id) as user_image FROM mods WHERE owner_id=?', [req.params.id], function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 222-2" + error }));
        }
    });
});

router.get('/mods/tags/:tag', function(req, res, next) {
    // TODO
    sql.query('SELECT *, (SELECT username from users where id=owner_id) as username FROM mods', function (error, results, filed) {
        if (!error) {
            var allMods = []
            for (result in results) {
                if (result['tags'].split(",").map(Function.prototype.call, String.prototype.trim).indexOf(req.params.tag)) {
                    allMods.push(result);
                }
            }
            return res.end(JSON.stringify(allMods));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 222-3" }));
        }
    });
});

router.get('/mods/images/:id', function(req, res, next) {
    // TODO
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    sql.query('SELECT mod_image FROM images WHERE mod_id=?', [req.params.id], function (error, results, filed) {
        if (!error) {
            sql.query('SELECT * FROM mods_views WHERE viewer_ip=? AND mod_id=?', [ip, req.params.id], function (error, r, filed) {
                if (!error) {
                    if (!r.length) {
                        sql.query('UPDATE mods SET views=views+1 WHERE id=?', [req.params.id], function (error, r, filed) {
                            sql.query('INSERT INTO mods_views (viewer_ip, mod_id, create_date) VALUES (?, ?, NOW())', [ip, req.params.id], function (error, r, filed) {
                                return res.end(JSON.stringify(results));
                            })
                        })
                        
                    } else {
                        return res.end(JSON.stringify(results));
                    }
                    
                }
            });
            
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 222-3" }));
        }
    });
    
});

// UPDATE mods
router.post('/update_mod', recaptcha.middleware.verify, function (req, res, next) {
    if (req.session.loggedin) {

        if (req.app.get('env') !== 'development' && (!req.body.captcha || req.recaptcha.error)) {
            return res.end(JSON.stringify({ status: "Please check the recaptcha." }));
        }

        sql.query('SELECT * FROM mods WHERE id=?', [
            req.body.mod_id
        ], function (error, results, filed) {
            if (results.length) {
                if (results[0].owner_id !== req.session.user_id) {
                    return res.end(JSON.stringify({ status: "Not Allowed." }));
                } else {
                    if (!req.session.user_id) {
                        return res.end(JSON.stringify({ status: "Something went wrong." }));
                    } else if (!req.body.modname || req.body.modname.length > 45) {
                        return res.end(JSON.stringify({ status: "Invalid Mod name." }));
                    } else if (!req.body.mod_description || req.body.mod_description.length > 5000) {
                        return res.end(JSON.stringify({ status: "Invalid Description." }));
                    } else if (!req.body.tags || req.body.tags.length > 500) {   // fix this later TODO
                        return res.end(JSON.stringify({ status: "Invalid tags." }));
                    } else if (req.body.image.length > 1000) {
                        return res.end(JSON.stringify({ status: "Invalid image." }));
                    } else if (!req.body.maplink || req.body.maplink.length > 500) {
                        return res.end(JSON.stringify({ status: "Invalid map link." }));
                    } else {
                        sql.query('UPDATE mods SET modname=?, update_date=NOW(), mod_description=?, tags=?, images=?, maplink=? WHERE id=?', [
                            req.body.modname,
                            req.body.mod_description,
                            req.body.tags,
                            req.body.image,
                            req.body.maplink,
                            req.body.mod_id
                        ], function (error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 223" }));
                            }
                        });
                    }
                }
            }
        });        
    } else {
        return res.send(404);
    }
});

// DELETE mods
router.post('/delete_mod', recaptcha.middleware.verify, function (req, res, next) {
    if (req.session.loggedin) {

        if (req.app.get('env') !== 'development' && (!req.body.captcha || req.recaptcha.error)) {
            return res.end(JSON.stringify({ status: "Please check the recaptcha." }));
        }

        sql.query('SELECT * FROM mods WHERE id=?',
            [req.body.mod_id], function (error, results, filed) {
            if (results.length) {
                if (results[0].owner_id !== req.session.user_id) {
                    return res.end(JSON.stringify({ status: "Not Allowed." }));
                } else {
                    sql.query('DELETE FROM mods WHERE id=? AND owner_id=?', [
                        req.body.mod_id,
                        req.session.user_id
                    ], function (error, results, filed) {
                        if (!error) {
                            return res.end(JSON.stringify({ status: "success" }));
                        } else {
                            return res.end(JSON.stringify({ status: "Something went wrong! 224" }));
                        }
                    });
                }
            }
        });        
    } else {
        return res.send(404);
    }
});


// subscription action
router.get('/subscribers/sub_unsub', function (req, res, next) {
    //if (req.session.visited) {
        if (req.session.loggedin) {
            sql.query('SELECT * FROM subscriptions WHERE user_subs_id=? AND subscriber_id=?', [
                req.query.id,
                req.session.user_id
            ]
            , function (error, results, filed) {
                if (!error) {
                    if (results.length) {
                        sql.query('DELETE FROM subscriptions WHERE user_subs_id=? AND subscriber_id=?', [
                            req.query.id,
                            req.session.user_id
                        ], function(error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 231-2" }));
                            }
                        });
                        
                    } else {
                        sql.query('INSERT INTO subscriptions (user_subs_id, subscriber_id) VALUES (?, ?)', [
                            req.query.id,
                            req.session.user_id
                        ], function (error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 231" }));
                            }
                        });
                    }
                } else {
                    return res.end(JSON.stringify({ status: "Something went wrong! 231-1 " + error }));
                }
            })
        } else {
            return res.end(JSON.stringify({ status: "You're not logged in." }));
        }
    /*} else {
        if (req.app.get('env') !== 'development') {
            return res.send(404);
        } else {
            return res.end(JSON.stringify({ dev: "need to visit main page." }));
        }
    }*/
});

// list subscriptions
router.get('/subscribers/list', function (req, res, next) {
    //if (req.session.visited) {
        if (req.query.id) {
            sql.query('SELECT * FROM subscriptions WHERE user_subs_id=?', 
                [req.query.id]
            , function (error, results, filed) {
                if (!error) {
                    return res.end(JSON.stringify(results));
                }
            });
        } else {
            sql.query('SELECT * FROM subscriptions', function (error, results, filed) {
                if (!error) {
                    return res.end(JSON.stringify(results));
                }
            });
        }
    /*} else {
        if (req.app.get('env') !== 'development') {
            return res.send(404);
        } else {
            return res.end(JSON.stringify({ dev: "need to visit main page." }));
        }
    }*/
});

// comments CREATE
router.post('/comments/:guild/create', recaptcha.middleware.verify, function (req, res, next) {
    if (req.session.loggedin) {
        if (req.app.get('env') !== 'development' && (!req.body.captcha || req.recaptcha.error)) {
            return res.end(JSON.stringify({ status: "Please check the recaptcha." }));
        }

        if (req.params.guild === "users") {
            var guild = "users"
            var set_guild = "users_comments"
        } else if (req.params.guild === "mods") {
            var guild = "mods"
            var set_guild = "mods_comments"
        } else {
            res.send(404);
            return res.end(404);
        }

        sql.query('SELECT * FROM '+ guild +' WHERE id=?', 
            [req.body.user_id]
        , function (error, results, filed) {
            if (!error) {
                if (results.length) {
                    if (req.body.comment.length > 4000) {
                        return res.end(JSON.stringify({ status: "comment too long." }));
                    } else {
                        sql.query('INSERT INTO '+ set_guild +' (user_id, commented_to_id, create_date, update_date, comment) VALUES (?, ?, NOW(), NOW(), ?)', [
                            req.session.user_id,
                            req.body.user_id,
                            req.body.comment
                        ], function (error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 241" }));
                            }
                        });
                    }
                } else {
                    return res.end(JSON.stringify({ status: "User not found." }));
                }
            } else {
                return res.end(JSON.stringify({ status: "Something went wrong! 241" }));
            }
        });

    } else {
        return res.end(JSON.stringify({ status: "You're not logged in." }));
    }
});

// comments READ
router.get('/comments/:guild', function(req, res, next) {

    if (req.params.guild === "users") {
        var guild = "users"
        var set_guild = "users_comments"
    } else if (req.params.guild === "mods") {
        var guild = "mods"
        var set_guild = "mods_comments"
    } else {
        res.send(404);
        return res.end(404);
    }

    sql.query('SELECT * FROM '+ set_guild, function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 242-1" }));
        }
    });
});


router.get('/comments/:guild/:id', function(req, res, next) {

    if (req.params.guild === "users") {
        var guild = "users"
        var set_guild = "users_comments"
    } else if (req.params.guild === "mods") {
        var guild = "mods"
        var set_guild = "mods_comments"
    } else {
        res.send(404);
        return res.end(404);
    }

    sql.query('SELECT * FROM users_comments'+ set_guild +' WHERE user_id=?', 
        req.params.id
    , function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: "Something went wrong! 242-2" }));
        }
    });
});

// comments UPDATE
router.post('/comments/:guild/update', recaptcha.middleware.verify, function (req, res, next) {
    if (req.session.loggedin) {

        /*if (req.app.get('env') !== 'development' && (!req.body.captcha || req.recaptcha.error)) {
            return res.end(JSON.stringify({ status: "Please check the recaptcha." }));
        }*/

        if (req.params.guild === "users") {
            var guild = "users"
            var set_guild = "users_comments"
        } else if (req.params.guild === "mods") {
            var guild = "mods"
            var set_guild = "mods_comments"
        } else {
            res.send(404);
            return res.end(404);
        }

        sql.query('SELECT * FROM '+ set_guild +' WHERE id=?', 
            [req.body.id]
        , function (error, results, filed) {
            if (results.length) {
                if (results[0].user_id !== req.session.user_id) {
                    return res.end(JSON.stringify({ status: "Not Allowed." }));
                } else {
                    if (!req.session.user_id) {
                        return res.end(JSON.stringify({ status: "Something went wrong." }));
                    } else if (!req.body.comment || req.body.comment.length > 4000) {
                        return res.end(JSON.stringify({ status: "Invalid comment." }));
                    } else {
                        sql.query('UPDATE '+ set_guild +'users_comments SET comment=?, update_date=NOW() WHERE id=?', [
                            req.body.comment,
                            req.body.id
                        ], function (error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 243" }));
                            }
                        });
                    }
                }
            }
        });        
    } else {
        return res.send(404);
    }
});

// comments DELETE
router.post('/comments/:guild/delete', recaptcha.middleware.verify, function (req, res, next) {
    if (req.session.loggedin) {

        if (req.params.guild === "users") {
            var guild = "users"
            var set_guild = "users_comments"
        } else if (req.params.guild === "mods") {
            var guild = "mods"
            var set_guild = "mods_comments"
        } else {
            res.send(404);
            return res.end(404);
        }

        sql.query('SELECT * FROM '+ set_guild +' WHERE id=?', [
            req.body.id
        ], function (error, results, filed) {
            if (results.length) {
                if (results[0].user_id !== req.session.user_id) {
                    return res.end(JSON.stringify({ status: "Not Allowed." }));
                } else {
                    sql.query('DELETE FROM '+ set_guild +' WHERE id=? AND user_id=?', [
                        req.body.id,
                        req.session.user_id
                    ], function (error, results, filed) {
                        if (!error) {
                            return res.end(JSON.stringify({ status: "success" }));
                        } else {
                            return res.end(JSON.stringify({ status: "Something went wrong! 244" }));
                        }
                    });
                }
            }
        });        
    } else {
        return res.send(404);
    }
});

// like/fav action
router.get('/on-off/mods/:action', function (req, res, next) {
    //if (req.session.visited) {
        if (req.params.action === "likes") {
            var set_action = "mods_likes"
        } else if (req.params.action === "favorites") {
            var set_guild = "mods_favs"
        } else {
            res.send(404);
            return res.end(404);
        }
        if (req.session.loggedin) {
            sql.query('SELECT * FROM '+ set_guild +' WHERE mod_id=?, user_id=?', [
                req.query.id,
                req.session.user_id
            ], function (error, results, filed) {
                if (!error) {
                    if (results.length) {
                        sql.query('DELETE FROM '+ set_guild +' WHERE user_subs_id=? AND subscriber_id=?', [
                            req.query.id,
                            req.session.user_id
                        ], function(error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            }
                        });
                        
                    } else {
                        sql.query('INSERT INTO '+ set_guild +' (user_id, mod_id) VALUES (?, ?)', [
                            req.query.id,
                            req.session.user_id
                        ], function (error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: "success" }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 251" }));
                            }
                        });
                    }
                }
            })
        } else {
            return res.end(JSON.stringify({ status: "You're not logged in." }));
        }
    /*} else {
        if (req.app.get('env') !== 'development') {
            return res.send(404);
        } else {
            return res.end(JSON.stringify({ dev: "need to visit main page." }));
        }
    }*/
});

// list like/fav
router.get('/list/mods/:action', function (req, res, next) {
    //if (req.session.visited) {

        if (req.params.action === "likes") {
            var set_action = "mods_likes"
        } else if (req.params.action === "favorites") {
            var set_guild = "mods_favs"
        } else {
            res.send(404);
            return res.end(404);
        }

        if (req.query.id) {
            sql.query('SELECT * FROM '+ set_action +' WHERE user_subs_id=?', 
                [req.query.id]
            , function (error, results, filed) {
                if (!error) {
                    return res.end(JSON.stringify(results));
                }
            });
        } else {
            sql.query('SELECT * FROM '+ set_action, function (error, results, filed) {
                if (!error) {
                    return res.end(JSON.stringify(results));
                }
            });
        }
    /*} else {
        if (req.app.get('env') !== 'development') {
            return res.send(404);
        } else {
            return res.end(JSON.stringify({ dev: "need to visit main page." }));
        }
    }*/
});

// Views
router.get('/views/:mod_id', function (req, res, next) {
    sql.query('SELECT * FROM mods_views WHERE viewer_ip=? AND mod_id=?', [
        req.ip,
        req.params.mod_id
    ], function (error, results, filed) {
        if (!error) {
            if (!results.length) {
                sql.query('SELECT * FROM mods WHERE id=?', 
                    [req.params.mod_id]
                , function (error, results, filed) {
                    if (!error) {
                        if (results.length)
                        sql.query('INSERT INTO mods_views (viewer_ip, mod_id, create_date) VALUES (?, ?, NOW())', [
                            req.ip,
                            req.params.mod_id
                        ], function (error, results, filed) {
                            if (!error) {
                                return res.end(JSON.stringify({ status: 'success' }));
                            } else {
                                return res.end(JSON.stringify({ status: "Something went wrong! 261" }));
                            }
                        });
                    } else {
                        return res.end(JSON.stringify({ status: "Something went wrong! 262" }));
                    }
                    
                });
                
            } else {
                return res.end(JSON.stringify({ status: 'success' }));
            }
        }
    })
});

router.get('/user', function (req, res, next) {
    if (req.session.loggedin) {
        return res.end(JSON.stringify({ id: req.session.user_id, name: req.session.username, email: req.session.email}));
    } else {
        return res.end(JSON.stringify({ status: 'not logged in' }));
    }
});

router.get('/users', function (req, res, next) {
    sql.query('SELECT id, username, add_at, last_visit, user_image  FROM users', function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: 'Something Went wrong! 321' }));
        }
    })
});
router.get('/users/:id', function (req, res, next) {
    sql.query('SELECT id, username, add_at, last_visit, user_image  FROM users WHERE id=?', [req.params.id], function (error, results, filed) {
        if (!error) {
            return res.end(JSON.stringify(results));
        } else {
            return res.end(JSON.stringify({ status: 'Something Went wrong! 321' }));
        }
    })
});

router.get('/logout', function (req, res, next) {
    if (req.session.loggedin) {
        req.session.destroy();
        return res.end(JSON.stringify({ status: 'logged out' }));
    }
    return res.end(JSON.stringify({ status: "you're not logged in" }));
});

router.post('/user/avatar', upload.single('user_image'), async function (req, res) {
    if (req.session.loggedin) {
        const imagePath = path.join(__dirname, '/../public/images');
        const fileUpload = new Resize(imagePath, 300, 300);
        if (!req.file) {
            return res.status(401).json({error: 'Please provide an image'});
        }
        const filename = await fileUpload.save(req.file.buffer);
        sql.query('UPDATE users SET user_image=? WHERE id=?', ["https://hytale-mods.com/images/"+filename, req.session.user_id], function (error, results, filed) { // TODO; change url
            if (!error) {
                return res.end(JSON.stringify({ status: 'success', filename: "https://hytale-mods.com/images/"+filename}));
            } else {
                return res.end(JSON.stringify({ status: 'Something Went wrong! 441' }));
            }
        })

    } else 
    return res.end(JSON.stringify({ status: "you're not logged in" }));
  });
  
router.post('/user/name', function (req, res, next) {
    if (req.session.loggedin) {
        if (!req.body.name) {
            return res.end(JSON.stringify({ status: "Missing infos." }));
        }
        if (req.body.name > 42 || req.body.name <= 0) {
            return res.end(JSON.stringify({ status: "Invalid username." }));
        }
        sql.query('UPDATE users SET username=? WHERE id=?', [req.body.name, req.session.user_id], function (error, results, filed) {
            if (!error) {
                return res.end(JSON.stringify({ status: 'success' }));
            } else
            return res.end(JSON.stringify({ status: 'Something Went wrong! 442' }));
        })
    } else
    return res.end(JSON.stringify({ status: "you're not logged in" }));
});

router.post('/user/passwd', function (req, res, next) {
    if (req.session.loggedin) {
        if (!req.body.o_passwd || !req.body.passwd) {
            return res.end(JSON.stringify({ status: "Missing infos." }));
        }

        if (req.body.passwd.length < 8 || req.body.passwd > 300) {
            return res.end(JSON.stringify({ status: "Invalid Password." }));
        }

        sql.query("SELECT * FROM users WHERE email=?", [
            req.session.email
        ], function (error, results, field) {
            if (!error) {
                if (results.length <= 0) {
                    return res.end(JSON.stringify({ status: "This isn't supposed to happen." }));
                }
                var result = results[0]
                if (passwordHash.verify(req.body.o_passwd, result.passwd)) {
                    sql.query('UPDATE users SET passwd=? WHERE id=?', [passwordHash.generate(req.body.passwd), req.session.user_id], function (error, results, filed) {
                        if (!error) {
                            return res.end(JSON.stringify({ status: 'success' }));
                        } else
                        return res.end(JSON.stringify({ status: 'Something Went wrong! 443' }));
                    })
                } else {
                    return res.end(JSON.stringify({ status: "Wrong password" }));
                }
            } else {
                return res.end(JSON.stringify({ status: "Something went wrong!" }));
            }

        });
    } else
    return res.end(JSON.stringify({ status: "you're not logged in" }));
});

module.exports = router;
