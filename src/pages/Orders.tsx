import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

interface OrderItem {
    product_name: string;
    quantity: number;
    price_per_unit: number;
    total_price: number;
}

interface Order {
    _id: string;
    order_id: string;
    user_name: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping_charges: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    delivery_status: string;
    sha256_hash: string;
    created_at: string;
    delivered_at?: string;
}

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE}/api/orders/${user.email}`);
            const data = await res.json();
            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch orders', err);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'Processing': 'bg-yellow-100 text-yellow-700',
            'Shipped': 'bg-blue-100 text-blue-700',
            'Out for Delivery': 'bg-purple-100 text-purple-700',
            'Delivered': 'bg-green-100 text-green-700',
            'Cancelled': 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Processing':
                return <Clock size={20} />;
            case 'Shipped':
            case 'Out for Delivery':
                return <Truck size={20} />;
            case 'Delivered':
                return <CheckCircle size={20} />;
            default:
                return <Package size={20} />;
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 text-center">Loading Orders...</div>;
    }

    return (
        <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 My Orders</h1>
                <p className="text-gray-600 mb-8">Track and manage your product orders</p>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-6">Start shopping for agricultural products!</p>
                        <a
                            href="/products"
                            className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                        >
                            Browse Products
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                Order #{order.order_id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(order.delivery_status)}`}>
                                                {getStatusIcon(order.delivery_status)}
                                                <span>{order.delivery_status}</span>
                                            </div>
                                            <button
                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                            >
                                                {expandedOrder === order._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details (Expandable) */}
                                {expandedOrder === order._id && (
                                    <div className="p-6 bg-gray-50">
                                        {/* Items */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-900 mb-3">Order Items</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-lg">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{item.product_name}</p>
                                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-bold text-green-600">₹{item.total_price.toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-gray-900 mb-3">Price Details</h4>
                                            <div className="bg-white p-4 rounded-lg space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tax (18% GST)</span>
                                                    <span className="font-semibold">₹{order.tax.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Shipping</span>
                                                    <span className="font-semibold">
                                                        {order.shipping_charges === 0 ? 'FREE' : `₹${order.shipping_charges}`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                                    <span>Total Amount</span>
                                                    <span className="text-green-600">₹{order.total_amount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment & Blockchain */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-lg">
                                                <h4 className="font-bold text-gray-900 mb-2">Payment Method</h4>
                                                <p className="text-gray-600">{order.payment_method}</p>
                                                <p className={`text-sm mt-1 ${order.payment_status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    Status: {order.payment_status}
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <Shield className="text-green-600 mr-2" size={20} />
                                                    <h4 className="font-bold text-gray-900">Blockchain Verified</h4>
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono break-all">
                                                    {order.sha256_hash.substring(0, 32)}...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Order Summary (Always Visible) */}
                                {expandedOrder !== order._id && (
                                    <div className="p-6 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                                                <p className="text-sm text-gray-600">Payment: {order.payment_method}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="text-2xl font-bold text-green-600">₹{order.total_amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Orders;
