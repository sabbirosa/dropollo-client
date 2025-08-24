import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Shield, Truck, Users } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Fast Delivery",
      description: "Same-day and next-day delivery options across the country"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Shipping",
      description: "Full insurance coverage and secure handling of your parcels"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Real-time Tracking",
      description: "Track your parcel's journey with live updates and notifications"
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Wide Coverage",
      description: "Serving all major cities and remote areas nationwide"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your shipping needs"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Cities Covered" },
    { number: "99.9%", label: "Delivery Success" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Trusted by 50,000+ customers
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Fast & Secure
            <span className="text-primary block">Parcel Delivery</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience lightning-fast parcel delivery with real-time tracking, secure handling, 
            and nationwide coverage. Your trusted partner for all shipping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/track">Track Your Parcel</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/services">Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Dropollo?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive shipping solutions with cutting-edge technology 
              and exceptional customer service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ship?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who trust Dropollo for their shipping needs. 
            Get started today with our easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/registration">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-8">
              Trusted by Leading Companies
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-muted-foreground">Amazon</div>
          <div className="text-2xl font-bold text-muted-foreground">Shopify</div>
          <div className="text-2xl font-bold text-muted-foreground">WooCommerce</div>
          <div className="text-2xl font-bold text-muted-foreground">Magento</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
