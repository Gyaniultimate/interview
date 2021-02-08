const User = require("../models/User");

const adminEmails = ['gitanjit6@gmail.com', 'gitanjit.medhi@iitg.ac.in','gyanendraprakashjee@gmail.com'];

const isAdmin = (req, res) => {
    const user = res.locals.user;
    if (user) {
        const currentEmail = user.email;
        let check = false;
        adminEmails.forEach((email) => {
            if (email == currentEmail) {
                check = true;
            }
        })
        if (check == true) {
            return true;
        }
        
    }
    return false;

}

const reqAdminAuth = (req, res, next) => {
    const user = res.locals.user;
    console.log("user = ", user);
    if (isAdmin(req, res)) next();
    else res.redirect('error');
}

module.exports = {reqAdminAuth, isAdmin};