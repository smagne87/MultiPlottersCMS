/**
 * Created by smagne on 10/20/2016.
 */
module.exports = function(mongoose) {
    var PartSchema = mongoose.Schema({
        Name: String,
        Description: String,
        MainImage: String
    });

    var models = { Part: {} };
    if(!mongoose.model.Part){
        models.Part = mongoose.model('Part', PartSchema);
    }
    return models;
};