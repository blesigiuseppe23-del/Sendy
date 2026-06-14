import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-sky-600" />
              <span className="text-2xl font-bold text-white">SENDY</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md">
              Spedisci come un professionista. Confronta i migliori corrieri italiani,
              scegli il servizio più adatto alle tue esigenze e risparmia.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Link Utili</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipment"
                  className="text-slate-400 hover:text-sky-600 transition-colors text-sm"
                >
                  Nuova Spedizione
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="text-slate-400 hover:text-sky-600 transition-colors text-sm"
                >
                  Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-slate-400 hover:text-sky-600 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Mail className="h-4 w-4 text-sky-600" />
                <span>info@sendy.it</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Phone className="h-4 w-4 text-sky-600" />
                <span>+39 02 1234567</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 text-sky-600" />
                <span>Milano, Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} SENDY. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
