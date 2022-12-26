const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name: {
        required: true,
        type: String
    },
    quantity: {
        required: true,
        default: 0,
        type: Number
    }
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productSchema.set('toJSON', {
    virtuals: true
});

productSchema.findById = function (cb) {
    return this.model('Products').find({id: this.id}, cb);
};

const Product = mongoose.model('Products', productSchema);


exports.findByProductName = (product_name) => {
    return Product.find({product_name: product_name});
};
exports.findById = (id) => {
    return Product.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProduct= (productData) => {
    const product = new Product(productData);
    return product.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Product.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, products) {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            })
    });
};

exports.patchProduct = (id, productData) => {
    return Product.findOneAndUpdate({
        _id: id
    }, productData);
};

exports.removeById = (productId) => {
    return new Promise((resolve, reject) => {
        Product.deleteMany({_id: productId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

