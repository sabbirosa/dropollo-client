import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>();

  const handleContactSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone Support",
      details: [
        "General Inquiries: +1 (555) 123-4567",
        "Customer Support: +1 (555) 123-4568",
        "Sales Team: +1 (555) 123-4569",
      ],
      description: "Available 24/7 for urgent matters",
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Support",
      details: [
        "General: info@dropollo.com",
        "Support: support@dropollo.com",
        "Sales: sales@dropollo.com",
      ],
      description: "Response within 2-4 hours",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Office Locations",
      details: [
        "Headquarters: New York, NY",
        "West Coast: Los Angeles, CA",
        "Midwest: Chicago, IL",
      ],
      description: "Visit us during business hours",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 8:00 PM EST",
        "Saturday: 9:00 AM - 6:00 PM EST",
        "Sunday: 10:00 AM - 4:00 PM EST",
      ],
      description: "24/7 online support available",
    },
  ];

  const officeLocations = [
    {
      city: "New York",
      state: "NY",
      address: "123 Business Ave, Suite 100",
      zipCode: "10001",
      phone: "+1 (555) 123-4567",
      email: "nyc@dropollo.com",
      hours: "8:00 AM - 8:00 PM EST",
    },
    {
      city: "Los Angeles",
      state: "CA",
      address: "456 Commerce Blvd, Floor 2",
      zipCode: "90210",
      phone: "+1 (555) 123-4568",
      email: "la@dropollo.com",
      hours: "8:00 AM - 8:00 PM PST",
    },
    {
      city: "Chicago",
      state: "IL",
      address: "789 Corporate Dr, Unit 300",
      zipCode: "60601",
      phone: "+1 (555) 123-4569",
      email: "chicago@dropollo.com",
      hours: "8:00 AM - 8:00 PM CST",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            📞 Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our services? Need support with your shipment?
            We're here to help. Reach out to our team through any of the
            channels below.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as
                    possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Message sent successfully!
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        We'll get back to you within 2-4 hours.
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit(handleContactSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          id="firstName"
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          id="lastName"
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          {...register("phone")}
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="inquiryType">Inquiry Type *</Label>
                      <Select
                        onValueChange={(value) =>
                          register("inquiryType").onChange({
                            target: { value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="support">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="sales">Sales Question</SelectItem>
                          <SelectItem value="billing">Billing Issue</SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.inquiryType && (
                        <p className="text-red-500 text-sm mt-1">
                          Please select an inquiry type
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        id="subject"
                        placeholder="How can we help you?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        {...register("message", {
                          required: "Message is required",
                          minLength: {
                            value: 10,
                            message: "Message must be at least 10 characters",
                          },
                        })}
                        id="message"
                        placeholder="Please describe your inquiry in detail..."
                        rows={5}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {info.icon}
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-primary font-medium">
                        {info.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Visit Our Offices
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We have offices across the country to serve you better
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {office.city}, {office.state}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {office.address}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{office.zipCode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{office.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{office.hours}</span>
                  </div>
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
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What are your response times?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We aim to respond to all inquiries within 2-4 hours during
                  business hours. Urgent matters are handled immediately through
                  our 24/7 phone support.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I schedule a meeting?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes! We offer both in-person and virtual meetings. Contact our
                  sales team to schedule a consultation at your convenience.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Do you offer emergency support?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Absolutely. Our 24/7 phone support handles emergency
                  situations and urgent shipping needs around the clock.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Don't wait to experience the best parcel delivery service. Contact
            us today and let's discuss your shipping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Link to="tel:+15551234567">Call Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="mailto:info@dropollo.com">Email Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
