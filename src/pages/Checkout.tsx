import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCard, MapPin, CheckCircle, ArrowLeft, Package } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

interface CartItem {
    product: {
        _id: string;
        name: string;
        final_price: number;
        unit: string;
    };
    quantity: number;
}

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const cart: CartItem[] = location.state?.cart || [];

    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [processing, setProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    const subtotal = cart.reduce((sum, item) => sum + (item.product.final_price * item.quantity), 0);
    const tax = Math.floor(subtotal * 0.18);
    const shipping = subtotal > 5000 ? 0 : 100;
    const total = subtotal + tax + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const orderData = {
                user_id: user?.email || 'guest',
                user_name: user?.name || 'Guest User',
                items: cart.map(item => ({
                    product_id: item.product._id,
                    quantity: item.quantity
                })),
                shipping_address: formData,
                payment_method: paymentMethod
            };

            const res = await fetch(`${API_BASE}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) throw new Error('Order failed');

            const order = await res.json();
            setOrderId(order.order_id);
            setOrderPlaced(true);

            // Clear cart after 3 seconds and redirect
            setTimeout(() => {
                navigate('/orders');
            }, 3000);

        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
                <Package size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-2">Your order ID is:</p>
                    <p className="text-2xl font-mono font-bold text-green-600 mb-6">{orderId}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Order has been verified on blockchain. Redirecting to orders page...
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center text-green-600 hover:text-green-700 mb-6 font-semibold"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Products
                </button>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center mb-6">
                                    <MapPin className="text-green-600 mr-3" size={24} />
                                    <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                                        <input
                                            type="text"
                                            required
                                            pattern="[0-9]{6}"
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            pattern="[0-9]{10}"
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center mb-6">
                                    <CreditCard className="text-green-600 mr-3" size={24} />
                                    <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                                </div>

                                <div className="space-y-3">
                                    {['COD', 'UPI', 'Card', 'Net Banking'].map((method) => (
                                        <label key={method} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                            style={{ borderColor: paymentMethod === method ? '#16a34a' : '#e5e7eb' }}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method}
                                                checked={paymentMethod === method}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="mr-3"
                                            />
                                            <span className="font-semibold text-gray-900">{method === 'COD' ? 'Cash on Delivery' : method}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.product._id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.product.name} x {item.quantity}
                                        </span>
                                        <span className="font-semibold">
                                            ₹{(item.product.final_price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (18% GST)</span>
                                    <span className="font-semibold">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-green-600">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {subtotal > 5000 && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700 font-semibold">
                                    🎉 You saved ₹100 on shipping!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
