/**
 * Created by smagne on 10/18/2016.
 */
module.exports = function(mongoose) {
    var PlotterSchema = mongoose.Schema({
        Name: String,
        MainImage: String,
        Brand: String,
        PDFInfo: String,
        URLVideo: String,
        Images: String
    });

    var models = { Plotter: {} };
    if(!mongoose.model.Plotter){
        models.Plotter = mongoose.model('Plotter', PlotterSchema);
    }
    return models;
};