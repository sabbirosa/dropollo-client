import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Link } from "react-router";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$9.99",
      period: "per shipment",
      description: "Perfect for occasional shipping needs",
      features: [
        "Standard delivery (3-5 days)",
        "Basic tracking",
        "Insurance up to $100",
        "Email notifications",
        "Customer support"
      ],
      notIncluded: [
        "Express delivery",
        "Signature confirmation",
        "Priority handling",
        "SMS notifications"
      ],
      popular: false,
      cta: "Get Started",
      href: "/registration"
    },
    {
      name: "Professional",
      price: "$19.99",
      period: "per shipment",
      description: "Ideal for regular business shipping",
      features: [
        "Express delivery (1-2 days)",
        "Advanced tracking",
        "Insurance up to $500",
        "Signature confirmation",
        "SMS notifications",
        "Priority handling",
        "Dedicated support line"
      ],
      notIncluded: [
        "Same day delivery",
        "International shipping",
        "Custom packaging"
      ],
      popular: true,
      cta: "Most Popular",
      href: "/registration"
    },
    {
      name: "Enterprise",
      price: "$49.99",
      period: "per shipment",
      description: "Premium service for critical shipments",
      features: [
        "Same day delivery",
        "Live tracking",
        "Insurance up to $1000",
        "White glove service",
        "Custom packaging",
        "Priority support",
        "Account manager",
        "Volume discounts"
      ],
      notIncluded: [
        "International shipping",
        "Bulk shipping rates"
      ],
      popular: false,
      cta: "Contact Sales",
      href: "/contact"
    }
  ];

  const addOns = [
    {
      name: "Package Insurance",
      description: "Additional coverage beyond standard limits",
      price: "$2.99",
      period: "per $100 coverage"
    },
    {
      name: "Signature Confirmation",
      description: "Recipient signature required for delivery",
      price: "$3.99",
      period: "per shipment"
    },
    {
      name: "Saturday Delivery",
      description: "Weekend delivery service",
      price: "$9.99",
      period: "per shipment"
    },
    {
      name: "Custom Packaging",
      description: "Professional packaging materials",
      price: "$14.99",
      period: "per package"
    }
  ];

  const bulkPricing = [
    {
      volume: "10-50 shipments",
      discount: "15% off",
      description: "Monthly volume commitment"
    },
    {
      volume: "51-100 shipments",
      discount: "25% off",
      description: "Quarterly volume commitment"
    },
    {
      volume: "100+ shipments",
      discount: "35% off",
      description: "Annual volume commitment"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            💰 Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect shipping plan for your needs. No hidden fees, 
            no surprises. Just reliable delivery at competitive prices.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    {plan.price}
                  </div>
                  <div className="text-muted-foreground">{plan.period}</div>
                  <CardDescription className="text-base mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="text-sm font-medium text-foreground">What's included:</div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-sm font-medium text-foreground mt-4">Not included:</div>
                    <ul className="space-y-2">
                      {plan.notIncluded.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-red-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                    <Link to={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Additional Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customize your shipping experience with these optional add-ons
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    {addon.price}
                  </div>
                  <div className="text-sm text-muted-foreground">{addon.period}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{addon.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Pricing */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Volume Discounts
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Save more with higher volume commitments
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {bulkPricing.map((tier, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{tier.volume}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {tier.discount}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tier.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are there any hidden fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No, all our pricing is transparent. The price you see is the price you pay. 
                  Additional services like insurance or signature confirmation are clearly listed as add-ons.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately for new shipments.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We offer full refunds if we fail to meet our delivery time guarantees. 
                  Contact our support team for assistance.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Choose your plan and start shipping with confidence. 
            Our team is here to help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/registration">Start Shipping</Link>
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
