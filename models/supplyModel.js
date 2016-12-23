/**
 * Created by smagne on 10/20/2016.
 */
module.exports = function(mongoose) {
    var SupplySchema = mongoose.Schema({
        Name: String,
        Type: String,
        Width: String,
        Length: String,
        Category: String,
        Price: String
    });

    var models = { Supply: {} };
    if(!mongoose.model.Supply){
        models.Supply = mongoose.model('Supply', SupplySchema);
    }
    return models;
};