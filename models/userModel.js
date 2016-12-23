module.exports = function(mongoose) {
    var UserSchema = mongoose.Schema({
        Username: String,
        Password: String,
        Email: String,
        Image: String,
        IsAdmin: Boolean,
        FullName: String
    });

    var models = { User: {} };
    if(!mongoose.model.User){
        models.User = mongoose.model('User', UserSchema);
    }
    return models;
};