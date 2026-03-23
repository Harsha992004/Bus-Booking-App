import React from 'react';
import { Bus, Mail, Phone, MapPin, Clock, Shield, CreditCard, Users, HelpCircle } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: 'How do I book a bus ticket?',
      answer: 'Simply search for buses using your departure city, destination, and travel date. Select a bus, choose your seats, enter passenger details, and complete the payment to confirm your booking.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, net banking, and popular digital wallets. All payments are processed securely through our payment gateway.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 24 hours before departure. Refund policies vary by bus operator - please check the specific terms during booking.'
    },
    {
      question: 'How do I get my ticket?',
      answer: 'After successful payment, your e-ticket is sent to your registered email address. You can also view and download it from the "My Bookings" section.'
    },
    {
      question: 'What if I miss my bus?',
      answer: 'If you miss your bus, please contact our customer support immediately. Some operators may allow rebooking on the next available bus subject to availability and terms.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information. Your data is never shared with third parties without your consent.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">Call us anytime for assistance</p>
            <p className="text-primary-600 font-medium mt-2">1-800-BUS-BOOK</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">Get help via email</p>
            <p className="text-primary-600 font-medium mt-2">support@busbooking.com</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600">Average response time</p>
            <p className="text-primary-600 font-medium mt-2">Under 2 hours</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-sm text-gray-600">Your data is safe with us</p>
            <p className="text-primary-600 font-medium mt-2">SSL Encrypted</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-gray-600">1-800-BUS-BOOK (1-800-287-2665)</p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-gray-600">support@busbooking.com</p>
                  <p className="text-sm text-gray-500">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Office Address</p>
                  <p className="text-gray-600">123 Travel Street, New York, NY 10001</p>
                  <p className="text-sm text-gray-500">Mon-Fri: 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Payment Issues</span>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Account Management</span>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Bus className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Booking & Cancellation</span>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Safety & Security</span>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Emergency Support</h3>
              <p className="text-red-700">For urgent travel issues, call our emergency hotline: 1-800-URGENT-BUS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
