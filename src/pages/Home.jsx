import { Link } from 'react-router-dom';
import { DogIcon, ClockIcon, HeartIcon, ShieldIcon } from '../components/Icons';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav className="nav">
        <div className="nav-content container">
          <Link to="/" className="nav-brand">
            <DogIcon size={32} />
            <span>PawWalkers</span>
          </Link>
          <div className="nav-links">
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login" className="btn btn-primary">Client Login</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Your Dog's Happy Place</h1>
          <p className="hero-subtitle">
            Professional, reliable dog walking and pet care services tailored to your furry friend's needs
          </p>
          <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary btn-lg">Request a Booking</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Client Portal</Link>
          </div>

          <div className="grid md:grid-cols-4 mt-8">
            <div className="feature-card">
              <div className="feature-icon"><ClockIcon size={32} /></div>
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Morning, afternoon, or evening walks to fit your schedule</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><HeartIcon size={32} /></div>
              <h3 className="font-semibold mb-2">Personal Care</h3>
              <p className="text-gray-600">Individual attention and care for each dog's unique needs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldIcon size={32} /></div>
              <h3 className="font-semibold mb-2">Fully Insured</h3>
              <p className="text-gray-600">Licensed, insured, and trusted professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><DogIcon size={32} /></div>
              <h3 className="font-semibold mb-2">All Breeds Welcome</h3>
              <p className="text-gray-600">From tiny terriers to gentle giants</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card card-hover">
              <h3 className="text-xl font-semibold mb-3">Solo Walks</h3>
              <p className="text-gray-600 mb-4">One-on-one attention for your dog. Perfect for dogs who prefer individual walks or need special care.</p>
              <p className="text-primary font-semibold">From £15</p>
            </div>
            <div className="card card-hover">
              <h3 className="text-xl font-semibold mb-3">Group Walks</h3>
              <p className="text-gray-600 mb-4">Socialization and exercise with other friendly dogs in small groups (max 4 dogs).</p>
              <p className="text-primary font-semibold">From £12</p>
            </div>
            <div className="card card-hover">
              <h3 className="text-xl font-semibold mb-3">Puppy Visits</h3>
              <p className="text-gray-600 mb-4">Quick check-ins for puppies including feeding, toilet breaks, and playtime.</p>
              <p className="text-primary font-semibold">From £10</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DogIcon size={24} />
                <span className="text-lg font-bold" style={{ color: 'white' }}>PawWalkers</span>
              </div>
              <p className="text-sm">Professional dog walking services you can trust</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'white' }}>Quick Links</h4>
              <Link to="/services" className="footer-link">Services</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/login" className="footer-link">Client Login</Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'white' }}>Contact</h4>
              <p className="text-sm">Email: hello@pawwalkers.com</p>
              <p className="text-sm">Phone: 020 1234 5678</p>
              <p className="text-sm mt-2">Mon-Sat: 7am - 7pm</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
