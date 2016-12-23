/**
 * Created by smagne on 10/20/2016.
 */
module.exports = function(mongoose) {
    var BrandSchema = mongoose.Schema({
        Code: String,
        Name: String,
        Logo: String
    });

    var models = { Brand: {} };
    if(!mongoose.model.Brand){
        models.Brand = mongoose.model('Brand', BrandSchema);
    }
    return models;
};