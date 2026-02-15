import { Link } from 'react-router-dom';
import { DogIcon } from '../components/Icons';

export default function ServicesPage() {
  const services = [
    {
      name: 'Solo Walk',
      price: 'From £15',
      duration: '30-60 minutes',
      description: 'One-on-one attention for your dog with a dedicated walker. Perfect for dogs who prefer individual walks, need special care, or are in training.',
      features: ['Individual attention', 'Flexible timing', 'Customized route', 'Photo updates'],
    },
    {
      name: 'Group Walk',
      price: 'From £12',
      duration: '45-60 minutes',
      description: 'Socialization and exercise with up to 4 friendly dogs. Great for social dogs who love playing with others.',
      features: ['Small group (max 4 dogs)', 'Socialization', 'Exercise and play', 'Supervised interactions'],
    },
    {
      name: 'Puppy Visit',
      price: 'From £10',
      duration: '20-30 minutes',
      description: 'Quick check-ins perfect for puppies or dogs needing shorter, more frequent breaks.',
      features: ['Toilet break', 'Feeding if needed', 'Fresh water', 'Playtime and training'],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav className="nav">
        <div className="nav-content container">
          <Link to="/" className="nav-brand">
            <DogIcon size={32} />
            <span>PawWalkers</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login" className="btn btn-primary">Client Login</Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Professional dog walking and pet care tailored to your dog's individual needs
        </p>

        <div className="space-y-6">
          {services.map((service, index) => (
            <div key={index} className="card">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-primary font-semibold text-xl mb-1">{service.price}</p>
                  <p className="text-gray-600">{service.duration}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600">✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">Ready to book?</h2>
          <Link to="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
