import { Product } from '../models/product.model.js'

export const newProduct = async (req, res) => {
    try {
        const { name, category, image, options } = req.body
        if (!name || !category || !image || !options || !options[0].price) {
            return res.status(400).json({
                success: false,
                message: "Missing required schema validation fields."
            });
        }

    
        const newProduct = new Product({
            name,
            category,
            image,
            options,
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            success: true,
            product: savedProduct
        });

    } catch (error) {
        console.error("Product upload failure:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error: Could not save product.",
            error: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        if (!product) {
            res.status(404).json({ message: "Product does not exist" })
        }

        res.status(200).json(product)
    } catch (error) {
        res.json(500).json({ message: "Error fetching product", error: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({ message: "Product not found" })
        }

        const { name, category, image, options } = req.body;

        if (!name || !category || !image || !options || !options[0]?.price) {
            return res.status(400).json({
                success: false,
                message: "Missing required schema validation fields."
            });
        }

        product.name = name
        product.category = category
        product.image = image
        product.options = options

        const updatedProduct = await Product.save()

        res.status(200).json({ success: true, message: "Product updated", product: updatedProduct })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error updating product", error: error.message })
    }

}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    return res.json({ message: "Product has been deleted from the database" })
}






// 1. Extract the secret key from the request headers
// const adminKey = req.headers['x-admin-key'];

// // 2. Validate the key against your production environment variable
// if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
//     return res.status(403).json({
//         success: false,
//         message: "Unauthorized: Access denied. Invalid secret key."
//     });
// }

// // 3. Extract product info from the request body
// console.log("Authorized access. Adding product to DB:", req.body);
// const { name, category, image, options, isAvailable } = req.body;
