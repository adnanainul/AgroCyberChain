import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to transform your farming operations? Contact us to learn more
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Email</p>
                  <p className="text-gray-300">contact@agrochain.com</p>
                  <p className="text-gray-300">support@agrochain.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Phone</p>
                  <p className="text-gray-300">+91 98765 43210</p>
                  <p className="text-gray-300">+91 87654 32109</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Address</p>
                  <p className="text-gray-300">Smart Agriculture Hub</p>
                  <p className="text-gray-300">Innovation Center, Bangalore, India</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <Github size={24} />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

            {submitted ? (
              <div className="bg-green-500/20 border border-green-500 text-green-100 p-6 rounded-xl text-center">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                <p>Thank you for contacting us. Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all text-white placeholder-gray-300"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all text-white placeholder-gray-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all text-white placeholder-gray-300"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all resize-none text-white placeholder-gray-300"
                    placeholder="Tell us about your farming needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 text-center border-t border-white/20 pt-8">
          <p className="text-gray-300">
            &copy; 2025 AgroChain - Smart Agriculture Platform. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Empowering farmers with IoT, AI/ML, and Blockchain technology
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
