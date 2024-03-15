const mongoose = require("mongoose");
const Shema =mongoose.Schema;
const PasswordResetShema= new Shema({
    userId :String,
    resetString :String,
    createdAt: Date,
    exporesAt: Date,

});
const PasswordReset = mongoose.model('PasswordReset', PasswordResetShema);
module.exports=PasswordReset;