import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Package, Plane, Shield, Ship, Truck, Users } from "lucide-react";
import { Link } from "react-router";

export default function Services() {
  const services = [
    {
      icon: <Truck className="h-12 w-12 text-primary" />,
      title: "Standard Delivery",
      description: "Reliable ground delivery within 3-5 business days",
      features: ["Tracking included", "Insurance up to $100", "Signature confirmation available"],
      price: "From $9.99",
      popular: false
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Express Delivery",
      description: "Fast delivery within 1-2 business days",
      features: ["Priority handling", "Insurance up to $500", "Real-time tracking", "SMS notifications"],
      price: "From $19.99",
      popular: true
    },
    {
      icon: <Plane className="h-12 w-12 text-primary" />,
      title: "Same Day Delivery",
      description: "Ultra-fast delivery within hours",
      features: ["Premium handling", "Insurance up to $1000", "Live tracking", "Priority support"],
      price: "From $49.99",
      popular: false
    },
    {
      icon: <Ship className="h-12 w-12 text-primary" />,
      title: "International Shipping",
      description: "Worldwide delivery with customs handling",
      features: ["Customs documentation", "Insurance up to $2000", "Multi-language support", "Duty calculation"],
      price: "From $29.99",
      popular: false
    },
    {
      icon: <Package className="h-12 w-12 text-primary" />,
      title: "Bulk Shipping",
      description: "Cost-effective solutions for large volumes",
      features: ["Volume discounts", "Dedicated account manager", "Custom packaging", "Scheduled pickups"],
      price: "Custom pricing",
      popular: false
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Premium Care",
      description: "Special handling for fragile and valuable items",
      features: ["White glove service", "Full insurance coverage", "Temperature control", "Security escort"],
      price: "From $79.99",
      popular: false
    }
  ];

  const additionalServices = [
    {
      title: "Package Insurance",
      description: "Comprehensive coverage for your valuable shipments",
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      title: "Real-time Tracking",
      description: "Monitor your parcel's journey with live updates",
      icon: <MapPin className="h-6 w-6 text-primary" />
    },
    {
      title: "Signature Confirmation",
      description: "Ensure secure delivery with recipient verification",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Custom Packaging",
      description: "Professional packaging solutions for any item",
      icon: <Package className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            🚀 Our Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Shipping Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From same-day local delivery to international shipping, we offer a complete range 
            of parcel delivery services tailored to your needs.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                  <div className="text-2xl font-bold text-primary mt-2">
                    {service.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={service.popular ? "default" : "outline"}>
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Additional Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your shipping experience with our value-added services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-3">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Service Coverage
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive coverage across the country and internationally
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Domestic Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Major Cities</span>
                    <Badge variant="secondary">Same Day</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Metropolitan Areas</span>
                    <Badge variant="secondary">Next Day</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Regional Centers</span>
                    <Badge variant="secondary">2-3 Days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Remote Areas</span>
                    <Badge variant="secondary">3-5 Days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  International Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>North America</span>
                    <Badge variant="secondary">2-3 Days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Europe</span>
                    <Badge variant="secondary">3-5 Days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Asia Pacific</span>
                    <Badge variant="secondary">4-7 Days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Rest of World</span>
                    <Badge variant="secondary">5-10 Days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Ship with Dropollo?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Choose the perfect shipping solution for your needs and experience 
            reliable, fast, and secure parcel delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/registration">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
