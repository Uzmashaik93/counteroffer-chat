import Image from "next/image";
import React from "react";
import logo from "@/public/images/trendies (1).svg";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-10 py-10 text-sm">
      <div className="max-w-7xl mx-auto flex flex-row flex-wrap justify-between md:flex-row md:justify-between gap-10">
        {/* Logo */}
        <div className="flex justify-start md:mb-50">
          <Image src={logo} width={200} height={60} alt="Logo" />
        </div>

        {/* Customer Care */}
        <div className="md:w-auto">
          <h4 className="font-extrabold mb-4">Customer Care</h4>
          <ul className="space-y-1 text-white/90">
            <li>Support Center</li>
            <li>Authenticity</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>Consignment</li>
            <li>FAQ</li>
            <li>Sustainability</li>
            <li>My Privacy Choices</li>
            <li>Refer a Friend</li>
          </ul>
        </div>

        {/* Company */}
        <div className=" md:w-auto">
          <h4 className="font-extrabold mb-4">Company</h4>
          <ul className="space-y-1 text-white/90">
            <li>About Us</li>
            <li>Team</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Investor</li>
            <li>Partners</li>
            <li>Social Impact</li>
            <li>Business Sellers</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="w-full md:w-auto">
          <h4 className="font-extrabold mb-4">Legal & Policies</h4>
          <ul className="space-y-1 text-white/90">
            <li>Terms of Service</li>
            <li>Terms of Use</li>
            <li>Consignor Terms</li>
            <li>Privacy Policy</li>
            <li>Accessibility</li>
            <li>Cookie Policy</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="w-full md:w-auto">
          <h4 className="font-extrabold mb-4">Follow Us</h4>
          <div className="flex gap-4 flex-wrap text-white text-lg">
            <Instagram size={20} />
            <Facebook size={20} />
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M20.66 3H17.74L12.56 10.17 6.85 3H2.72L9.79 11.88 2.18 21H5.1L10.71 13.25 16.85 21h4.14L13.41 11.63 20.66 3Z" />
            </svg>
            <Linkedin size={20} />
            <Youtube size={20} />
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M16.5 3c.4 1.7 1.9 3 3.5 3v3.5c-1.8 0-3.5-.6-4.8-1.7v7.8c0 3.4-2.7 6.4-6.1 6.4S3 19.9 3 16.6s2.7-6.3 6.1-6.3c.5 0 1.1.1 1.6.3v3.7a3.2 3.2 0 0 0-1.6-.5c-1.6 0-3 1.4-3 2.9 0 1.6 1.4 3.1 3 3.1 1.5 0 2.9-1.6 2.9-3.2V3h4.1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-12">
        <div className="border-t border-white/20"></div>
        <div className="text-center text-white text-xs pt-4">
          &copy; {new Date().getFullYear()} Trendies. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
