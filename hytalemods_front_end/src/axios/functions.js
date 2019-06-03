import * as requests from './requests';

// TODO: Read until complete

/***************
 *             *
 *     GET     *
 *             *
 ***************/

export async function get_mods () {
    const ent = await requests.getMods();
    if (ent) {
        return await ent.data
    }
        
}

export async function get_mod_images (id) {
    const ent = await requests.getModImages(id);
    console.log("ent " + ent)
    if (ent) {
        return await ent.data
    }
        
}

export async function get_users (id) {
    const ent = await requests.getUsers(id);
    if (ent)
        return ent.data
}

export async function get_user_status () {
    const ent = await requests.userStatus();
    if (ent)
        return ent.data
}

export async function get_mod_by_id (id) {
    const ent = await requests.getMod(id);
    if (ent)
        return ent.data
}

export async function get_mod_by_owner_id (id) {
    const ent = await requests.getModByOwner(id);
    if (ent)
        return ent.data
}

export async function get_mods_by_tags (tag) {
    const ent = await requests.getModsByTags(tag);
    if (ent)
        return ent.data
}

export async function list_likes (id) {
    const ent = await requests.listLikes(id);
    if (ent)
        return ent.data
}

export async function list_subs (id) {
    const ent = await requests.listSubs(id);
    if (ent)
        return ent.data
}

export async function list_favorites (id) {
    const ent = await requests.favoriteListMod(id);
    if (ent)
        return ent.data
}

export async function get_users_comment (id) {
    const ent = await requests.readUserComments(id);
    if (ent)
        return ent.data
}

export async function get_mods_comment (id) {
    const ent = await requests.readModComments(id);
    if (ent)
        return ent.data
}

export async function like_unlike (id) {
    const ent = await requests.likeMod(id);
    if (ent)
        return ent.data
}

export async function sub_unsub (id) {
    const ent = await requests.subUser(id);
    if (ent)
        return ent.data
}

export async function fav_unfav (id) {
    const ent = await requests.favoriteMod(id);
    if (ent)
        return ent.data
}

/***************
 *             *
 *     POST    *
 *             *
 ***************/

export async function do_login (email, passwd) {
     const ent = await requests.loginUser(email, passwd);
     if (ent)
        return ent.data
 }

 export async function do_signup (name, email, passwd, cpasswd, s) {//, recaptcha) {
    const ent = await requests.signupUser(name, email, passwd, cpasswd, s); // , recaptcha);
    if (ent)
        return ent.data
}

export async function do_logout () {//, recaptcha) {
    const ent = await requests.logOut(); // , recaptcha);
    if (ent)
        return ent.data
}

export async function create_mod (modname, mod_description, tags, maplink) { //, recaptcha) {
    const ent = await requests.createMod(modname, mod_description, tags, maplink);
    if (ent)
        return ent.data
}

export async function upload_images (image) { //, recaptcha) {
    const ent = await requests.uploadImage(image);
    if (ent)
        return ent.data
}

export async function update_mod (mod_id, modname, mod_description, tags, image, maplink, recaptcha) {
    const ent = await requests.updateMod(mod_id, modname, mod_description, tags, image, maplink, recaptcha);
    if (ent)
        return ent.data
}

export async function delete_mod (mod_id, recaptcha) {
    const ent = await requests.deleteMod(mod_id, recaptcha);
    if (ent)
        return ent.data
}

export async function create_user_comment (user_id, comment, recaptcha) {
    const ent = await requests.createUserComment(user_id, comment, recaptcha);
    if (ent)
        return ent.data
}

export async function update_user_comment (comment_id, comment) {
    const ent = await requests.updateUserComment(comment_id, comment);
    if (ent)
        return ent.data
}

export async function delete_user_comment (id) {
    const ent = await requests.deleteUserComment(id);
    if (ent)
        return ent.data
}

export async function create_mod_comment (user_id, comment, recaptcha) {
    const ent = await requests.createModComment(user_id, comment, recaptcha);
    if (ent)
        return ent.data
}

export async function update_mod_comment (comment_id, comment) {
    const ent = await requests.updateModComment(comment_id, comment);
    if (ent)
        return ent.data
}

export async function delete_mod_comment (id) {
    const ent = await requests.deleteModComment(id);
    if (ent)
        return ent.data
}

export async function change_avatar(avatar) {
    const ent = await requests.changeAvatar(avatar);
    if (ent)
        return ent.data
}

export async function update_user_name(name) {
    const ent = await requests.UpdateUserName(name);
    if (ent)
        return ent.data
}

export async function update_password(o_p, passwd) {
    const ent = await requests.updatePassword(o_p, passwd);
    if (ent)
        return ent.data
}
// addutional functions

