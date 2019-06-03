import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = true


// Done Access-Control-Allow-Origin
var API_ROOT = 'http://localhost:3001';

// Mods CRUD

// READ mods
export async function getMods () {
    try {
      return await axios.get(API_ROOT + '/api/v1/mods')
    } catch (error) {
      console.error(error)
    }
}

export async function getMod (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/mods/'+id)
    } catch (error) {
      console.error(error)
    }
}

export async function getModByOwner (id) {
  try {
    return await axios.get(API_ROOT + '/api/v1/mods/owner/'+id)
  } catch (error) {
    console.error(error)
  }
}

export async function getModsByTags (tag) {
    try {
        return await axios.get(API_ROOT + '/api/v1/mods/tags/'+tag)
    } catch (error) {
    console.error(error)
    }
}

export async function getModImages (id) {
  try {
      return await axios.get(API_ROOT + '/api/v1/mods/images/'+id)
  } catch (error) {
    console.error(error)
  }
}

// Create mod
export async function createMod (modname, mod_description, tags, maplink) { //, recaptcha) {
    try {
      var data = qs.stringify({modname: modname, mod_description: mod_description, tags:tags, maplink:maplink})
      //captcha

      return await axios.post(
        API_ROOT + '/api/v1/create',
        data,
        {'Content-Type': "application/x-www-form-urlencoded" }
        )
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

export async function uploadImage (image) { //, recaptcha) {
  try {
    return await axios.post(
      API_ROOT + '/api/v1/create/image',
      image,
      {'Content-Type': "multipart/form-data" }
      )
      .catch(function (response) {
          //handle error
          console.log(response);
      });

  } catch (error) {
    console.error(error)
  }
}

// Update mod
export async function updateMod (mod_id, modname, mod_description, tags, image, maplink, recaptcha) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('mod_id', mod_id);
      bodyFormData.set('modname', modname);
      bodyFormData.set('mod_description', mod_description);
      bodyFormData.set('tags', tags);
      bodyFormData.set('image', image);
      bodyFormData.set('maplink', maplink);
      //captcha

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/update_mod',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Delete mod
export async function deleteMod (mod_id, recaptcha) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('mod_id', mod_id);
      //captcha

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/delete_mod',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Likes
// Like/Unlike
export async function likeMod (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/on-off/mods/likes', {params:{id:id}})
    } catch (error) {
      console.error(error)
    }
}

// List likes
export async function listLikes (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/list/mods/likes', id?{params:{id:id}}:{})
    } catch (error) {
      console.error(error)
    }
}

// Subscriptions
// Sub/UnSub
export async function subUser (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/subscribers/sub_unsub', {params:{id:id}})
    } catch (error) {
      console.error(error)
    }
}

// List Subs
export async function listSubs (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/subscribers/list', id?{params:{id:id}}:{})
    } catch (error) {
      console.error(error)
    }
}


// Login
export async function loginUser (email, passwd) {
    try {

      var data = qs.stringify({email: email, passwd: passwd})

      return await axios.post(
        API_ROOT + '/api/v1/updates/login',
        data,
        {'Content-Type': "application/x-www-form-urlencoded" }
        )
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// change avatar
export async function changeAvatar(avatar) {
  try {

    return await axios.post(
      API_ROOT + '/api/v1/user/avatar',
      avatar,
      {'Content-Type': "multipart/form-data" }
      )
      .catch(function (response) {
          //handle error
          console.log(response);
      });

  } catch (error) {
    console.error(error)
  }
}

// update user name
export async function UpdateUserName(name) {
  try {

    var data = qs.stringify({name: name})

    return await axios.post(
      API_ROOT + '/api/v1/user/name',
      data,
      {'Content-Type': "application/x-www-form-urlencoded" }
      )
      .catch(function (response) {
          //handle error
          console.log(response);
      });

  } catch (error) {
    console.error(error)
  }
}

// update password
export async function updatePassword(o_passwd ,passwd) {
  try {

    var data = qs.stringify({o_passwd:o_passwd, passwd: passwd})

    return await axios.post(
      API_ROOT + '/api/v1/user/passwd',
      data,
      {'Content-Type': "application/x-www-form-urlencoded" }
      )
      .catch(function (response) {
          //handle error
          console.log(response);
      });

  } catch (error) {
    console.error(error)
  }
}

// Signup
export async function signupUser (name, email, passwd, cpasswd, s) { //, recaptcha) {
    try {
      var data = qs.stringify({name: name, email: email, passwd: passwd, cpasswd:cpasswd, service:s})
      
      // recaptcha


      return await axios.post(
        API_ROOT + '/api/v1/updates/signup',
        data,
        {'Content-Type': "application/x-www-form-urlencoded" }
        )
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Users Commants CRUD
// Create User Comment
export async function createUserComment (user_id, comment, recaptcha) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('user_id', user_id);
      bodyFormData.set('comment', comment);
      // captcha

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/comments/users/create',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
    } catch (error) {
      console.error(error)
    }
}

// Update User Comment
export async function updateUserComment (comment_id, comment) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('id', comment_id);
      bodyFormData.set('comment', comment);

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/comments/users/update',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Read User Comment
export async function readUserComments (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/comments/users' + id?id:'')
    } catch (error) {
      console.error(error)
    }
}

// Delete User Comment
export async function deleteUserComment (id) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('id', id);

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/comments/users/delete',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Users Commants CRUD
// Create Mod Comment
export async function createModComment (user_id, comment, recaptcha) {
    try {
      var bodyFormData = new FormData();
      bodyFormData.set('user_id', user_id);
      bodyFormData.set('comment', comment);
      // captcha

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/comments/mods/create',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Update Mod Comment
export async function updateModComment (comment_id, comment) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('id', comment_id);
      bodyFormData.set('comment', comment);
      // captcha

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/comments/mods/update',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Read Mod Comment
export async function readModComments (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/comments/mods' + id?id:'')
    } catch (error) {
      console.error(error)
    }
}

// Delete Mod Comment
export async function deleteModComment (id) {
    try {

      var bodyFormData = new FormData();
      bodyFormData.set('id', id);

      return await axios({
        method: 'post',
        url: API_ROOT + '/api/v1/comments/mods/delete',
        data: bodyFormData,
        config: { headers: {'Content-Type': "application/x-www-form-urlencoded" }}
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });

    } catch (error) {
      console.error(error)
    }
}

// Favorites
// Favorite Set/Reset
export async function favoriteMod (id) {
    try {
      return await axios.get(API_ROOT + '/api/v1/on-off/mods/favorites', {params:{
        id: id,
      }})
    } catch (error) {
      console.error(error)
    }
}

// Favorite list
export async function favoriteListMod (id) {
    try {
        return await axios.get(API_ROOT + '/api/v1/list/mods/favorites', id?{params:{id: id}}:{})
      } catch (error) {
        console.error(error)
      }
}

// User Status
export async function userStatus () {
    try {
        return await axios.get(API_ROOT + '/api/v1/user')
      } catch (error) {
        console.error(error)
      }
}

// Get Users
export async function getUsers (id) {
    try {
        var cont = id?"/"+id:""
        return await axios.get(API_ROOT + '/api/v1/users'+cont)
      } catch (error) {
        console.error(error)
      }
}

export async function logOut () {
  try {
      return await axios.get(API_ROOT + '/api/v1/logout')
    } catch (error) {
      console.error(error)
    }
}