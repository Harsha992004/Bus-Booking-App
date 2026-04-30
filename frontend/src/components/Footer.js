import React from 'react';
import { Armchair, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Armchair className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Book My Seat</span>
                <span className="text-xs text-primary-400 block">Andhra Pradesh State Transport</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Official online booking platform for Andhra Pradesh State Transport Corporation. 
              Book bus tickets across 30+ cities in AP with ease and comfort.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@bookmyseat.ap.gov.in</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>0866-2570000 (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>APSRTC Complex, Vijayawada, Andhra Pradesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/routes" className="text-gray-300 hover:text-white transition-colors">
                  Popular Routes
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-300 hover:text-white transition-colors">
                  Book Ticket
                </a>
              </li>
              <li>
                <a href="/my-bookings" className="text-gray-300 hover:text-white transition-colors">
                  My Bookings
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Book My Seat - Andhra Pradesh State Transport Corporation. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Official Online Booking Platform for APSRTC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
