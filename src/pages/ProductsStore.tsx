import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Star, Package, X, Plus, Minus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../services/apiConfig';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    discount: number;
    final_price: number;
    stock_quantity: number;
    unit: string;
    image_url: string;
    rating: number;
    reviews_count: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

const ProductsStore = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Equipment'];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [selectedCategory, searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/products`);
            const data = await res.json();
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch products', err);
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product._id === product._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
        showNotification('success', `${product.name} added to cart!`);
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.product._id === productId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product._id !== productId));
        showNotification('success', 'Item removed from cart');
    };

    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + (item.product.final_price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            showNotification('error', 'Your cart is empty!');
            return;
        }
        // Navigate to checkout with cart data
        navigate('/checkout', { state: { cart } });
    };

    if (loading) {
        return <div className="min-h-screen pt-24 text-center">Loading Products...</div>;
    }

    return (
        <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-20 right-4 z-[70] px-6 py-4 rounded-xl shadow-2xl flex items-center animate-bounce ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    <CheckCircle className="mr-3" />
                    <span className="font-bold">{notification.msg}</span>
                </div>
            )}

            {/* Cart Floating Button */}
            <button
                onClick={() => setShowCart(true)}
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform"
            >
                <ShoppingCart size={28} />
                {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
                        {getTotalItems()}
                    </span>
                )}
            </button>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 Agricultural Products Store</h1>
                    <p className="text-gray-600">Buy quality seeds, fertilizers, equipment, and more for your farm</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products found matching your criteria.
                        </div>
                    ) : filteredProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group">
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {product.discount > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {product.discount}% OFF
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {product.category}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">({product.reviews_count})</span>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    {product.discount > 0 && (
                                        <span className="text-sm text-gray-400 line-through mr-2">₹{product.price}</span>
                                    )}
                                    <span className="text-2xl font-bold text-green-600">₹{product.final_price}</span>
                                    <span className="text-sm text-gray-500">/{product.unit}</span>
                                </div>

                                {/* Stock */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-sm">
                                        <Package size={16} className="mr-1 text-gray-400" />
                                        <span className={product.stock_quantity > 50 ? 'text-green-600' : 'text-orange-600'}>
                                            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock_quantity === 0}
                                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${product.stock_quantity > 0
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105'
                                        : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex justify-end" onClick={() => setShowCart(false)}>
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart ({getTotalItems()})</h2>
                            <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.product._id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex gap-4">
                                                <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm mb-1">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">₹{item.product.final_price}/{item.product.unit}</p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, -1)}
                                                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, 1)}
                                                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(item.product._id)}
                                                            className="ml-auto text-red-600 hover:text-red-700"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-right font-bold text-green-600">
                                                ₹{(item.product.final_price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart Summary */}
                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">₹{getTotalPrice().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Tax (18%)</span>
                                        <span className="font-bold">₹{Math.floor(getTotalPrice() * 0.18).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-bold">{getTotalPrice() > 5000 ? 'FREE' : '₹100'}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span className="text-green-600">
                                            ₹{(getTotalPrice() + Math.floor(getTotalPrice() * 0.18) + (getTotalPrice() > 5000 ? 0 : 100)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Proceed to Checkout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductsStore;
