import ContactPage from './pages/Contact';

function AppRoutes() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/contact" component={ContactPage} />
    </Router>
  );
}