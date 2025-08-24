import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Globe, Heart, Shield, Target, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router";

export default function About() {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Reliability",
      description: "We deliver on our promises, every single time"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "Constantly improving our services with cutting-edge technology"
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Sustainability",
      description: "Committed to eco-friendly delivery solutions"
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description: "Started with a vision to revolutionize parcel delivery"
    },
    {
      year: "2019",
      title: "First 1000 Customers",
      description: "Reached our first major milestone in customer acquisition"
    },
    {
      year: "2020",
      title: "Nationwide Expansion",
      description: "Extended services to all major cities across the country"
    },
    {
      year: "2021",
      title: "Technology Platform",
      description: "Launched our advanced tracking and management system"
    },
    {
      year: "2022",
      title: "International Services",
      description: "Began offering worldwide shipping solutions"
    },
    {
      year: "2023",
      title: "50,000+ Happy Customers",
      description: "Achieved significant growth and customer satisfaction"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      position: "CEO & Founder",
      description: "Former logistics executive with 15+ years of industry experience",
      image: "👩‍💼"
    },
    {
      name: "Michael Chen",
      position: "CTO",
      description: "Technology leader specializing in logistics and supply chain solutions",
      image: "👨‍💻"
    },
    {
      name: "Emily Rodriguez",
      position: "Head of Operations",
      description: "Operations expert with deep knowledge in delivery optimization",
      image: "👩‍🔧"
    },
    {
      name: "David Kim",
      position: "Head of Customer Success",
      description: "Customer experience specialist focused on satisfaction and retention",
      image: "👨‍💼"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Cities Covered" },
    { number: "99.9%", label: "Delivery Success Rate" },
    { number: "24/7", label: "Customer Support" },
    { number: "5M+", label: "Parcels Delivered" },
    { number: "150+", label: "Team Members" }
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            🏢 About Dropollo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Trusted Partner in
            <span className="text-primary block">Parcel Delivery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founded in 2018, Dropollo has been revolutionizing the parcel delivery industry 
            with innovative technology, exceptional service, and unwavering commitment to customer satisfaction.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Target className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To provide fast, reliable, and secure parcel delivery services that connect people 
                  and businesses across the globe, making shipping simple and stress-free for everyone.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To become the world's most trusted and innovative parcel delivery platform, 
                  setting new standards for speed, reliability, and customer experience in the industry.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Dropollo by the Numbers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our growth and impact in numbers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our company's growth and development
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-muted mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="text-sm">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-lg font-semibold text-foreground">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to delivering excellence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.image}</div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {member.position}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="mb-20 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Awards & Recognition
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry recognition for our commitment to excellence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Best Delivery Service 2023</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Recognized by Logistics Today for outstanding customer service and delivery performance
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Customer Choice Award 2022</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Voted by customers as the most reliable parcel delivery service in the region
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Fastest Growing Company 2021</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Awarded by Business Growth Magazine for exceptional expansion and innovation
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
            Join the Dropollo Family
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Experience the difference that quality, reliability, and innovation make in parcel delivery. 
            Start shipping with confidence today.
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
    </div>
  );
}
