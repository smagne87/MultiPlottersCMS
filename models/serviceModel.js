/**
 * Created by smagne on 10/20/2016.
 */
module.exports = function(mongoose) {
    var ServiceSchema = mongoose.Schema({
        Name: String,
        Price: String
    });

    var models = { Service: {} };
    if(!mongoose.model.Service){
        models.Service = mongoose.model('Service', ServiceSchema);
    }
    return models;
};