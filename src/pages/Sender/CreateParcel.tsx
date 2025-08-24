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
import { useCreateParcelMutation } from "@/redux/feature/parcel/parcel.api";
import type { ICreateParcel } from "@/types";
import { calculateParcelFees, formatCurrency } from "@/utils/parcelUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createParcelSchema = z.object({
  receiver: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(11, "Phone number must be at least 11 digits"),
    address: z.object({
      street: z.string().min(5, "Street address must be at least 5 characters"),
      city: z.string().min(2, "City must be at least 2 characters"),
      state: z.string().min(2, "State must be at least 2 characters"),
      zipCode: z.string().min(4, "ZIP code must be at least 4 characters"),
      country: z.string().min(2, "Country must be at least 2 characters"),
    }),
  }),
  parcelDetails: z.object({
    type: z.enum(["document", "package", "fragile", "electronics", "other"]),
    weight: z.number().min(0.1, "Weight must be at least 0.1 kg"),
    length: z.number().min(1, "Length must be at least 1 cm").optional(),
    width: z.number().min(1, "Width must be at least 1 cm").optional(),
    height: z.number().min(1, "Height must be at least 1 cm").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    value: z.number().min(0, "Value must be non-negative").optional(),
  }),
  deliveryInfo: z.object({
    preferredDeliveryDate: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    urgency: z.enum(["standard", "express", "urgent"]),
  }),
});

type CreateParcelFormData = z.infer<typeof createParcelSchema>;

export default function CreateParcel() {
  const [createParcel, { isLoading }] = useCreateParcelMutation();
  const [calculatedFees, setCalculatedFees] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateParcelFormData>({
    resolver: zodResolver(createParcelSchema),
    defaultValues: {
      deliveryInfo: {
        urgency: "standard",
      },
      parcelDetails: {
        type: "package",
      },
    },
  });

  const watchedWeight = watch("parcelDetails.weight");
  const watchedType = watch("parcelDetails.type");
  const watchedUrgency = watch("deliveryInfo.urgency");

  // Calculate fees when weight, type, or urgency changes
  const updateFees = () => {
    if (watchedWeight && watchedType && watchedUrgency) {
      const fees = calculateParcelFees(
        watchedWeight,
        watchedUrgency,
        watchedType
      );
      setCalculatedFees(fees);
    }
  };

  // Update fees when dependencies change
  React.useEffect(() => {
    updateFees();
  }, [watchedWeight, watchedType, watchedUrgency]);

  const onSubmit = async (data: CreateParcelFormData) => {
    try {
      const parcelData: ICreateParcel = {
        receiver: data.receiver,
        parcelDetails: {
          type: data.parcelDetails.type,
          weight: data.parcelDetails.weight,
          description: data.parcelDetails.description,
          value: data.parcelDetails.value,
          ...(data.parcelDetails.length && {
            dimensions: {
              length: data.parcelDetails.length,
              width: data.parcelDetails.width!,
              height: data.parcelDetails.height!,
            },
          }),
        },
        deliveryInfo: {
          preferredDeliveryDate: data.deliveryInfo.preferredDeliveryDate
            ? new Date(data.deliveryInfo.preferredDeliveryDate)
            : undefined,
          deliveryInstructions: data.deliveryInfo.deliveryInstructions,
          urgency: data.deliveryInfo.urgency,
        },
      };

      await createParcel(parcelData).unwrap();
      toast.success("Parcel created successfully!");
      reset();
      setCalculatedFees(null);
    } catch (error) {
      toast.error("Failed to create parcel. Please try again.");
      console.error("Error creating parcel:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Parcel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Send your parcel to anywhere in the country
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Receiver Information */}
        <Card>
          <CardHeader>
            <CardTitle>Receiver Information</CardTitle>
            <CardDescription>
              Enter the recipient's details for delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiver.name">Full Name</Label>
                <Input
                  id="receiver.name"
                  {...register("receiver.name")}
                  placeholder="John Doe"
                />
                {errors.receiver?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="receiver.email">Email</Label>
                <Input
                  id="receiver.email"
                  type="email"
                  {...register("receiver.email")}
                  placeholder="john@example.com"
                />
                {errors.receiver?.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="receiver.phone">Phone</Label>
                <Input
                  id="receiver.phone"
                  {...register("receiver.phone")}
                  placeholder="+880 1XXXXXXXXX"
                />
                {errors.receiver?.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiver.address.street">Street Address</Label>
                <Input
                  id="receiver.address.street"
                  {...register("receiver.address.street")}
                  placeholder="123 Main Street"
                />
                {errors.receiver?.address?.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.address.street.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="receiver.address.city">City</Label>
                <Input
                  id="receiver.address.city"
                  {...register("receiver.address.city")}
                  placeholder="Dhaka"
                />
                {errors.receiver?.address?.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.address.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="receiver.address.state">State/Province</Label>
                <Input
                  id="receiver.address.state"
                  {...register("receiver.address.state")}
                  placeholder="Dhaka"
                />
                {errors.receiver?.address?.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.address.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="receiver.address.zipCode">ZIP Code</Label>
                <Input
                  id="receiver.address.zipCode"
                  {...register("receiver.address.zipCode")}
                  placeholder="1200"
                />
                {errors.receiver?.address?.zipCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.address.zipCode.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="receiver.address.country">Country</Label>
                <Input
                  id="receiver.address.country"
                  {...register("receiver.address.country")}
                  placeholder="Bangladesh"
                />
                {errors.receiver?.address?.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiver.address.country.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parcel Details */}
        <Card>
          <CardHeader>
            <CardTitle>Parcel Details</CardTitle>
            <CardDescription>
              Describe your parcel and its specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="parcelDetails.type">Parcel Type</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("parcelDetails.type", value as any)
                  }
                  defaultValue="package"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="fragile">Fragile</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parcelDetails.weight">Weight (kg)</Label>
                <Input
                  id="parcelDetails.weight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  {...register("parcelDetails.weight", { valueAsNumber: true })}
                  placeholder="2.5"
                />
                {errors.parcelDetails?.weight && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.parcelDetails.weight.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="deliveryInfo.urgency">Urgency</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("deliveryInfo.urgency", value as any)
                  }
                  defaultValue="standard"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="parcelDetails.length">Length (cm)</Label>
                <Input
                  id="parcelDetails.length"
                  type="number"
                  min="1"
                  {...register("parcelDetails.length", { valueAsNumber: true })}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="parcelDetails.width">Width (cm)</Label>
                <Input
                  id="parcelDetails.width"
                  type="number"
                  min="1"
                  {...register("parcelDetails.width", { valueAsNumber: true })}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="parcelDetails.height">Height (cm)</Label>
                <Input
                  id="parcelDetails.height"
                  type="number"
                  min="1"
                  {...register("parcelDetails.height", { valueAsNumber: true })}
                  placeholder="15"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="parcelDetails.description">Description</Label>
              <Textarea
                id="parcelDetails.description"
                {...register("parcelDetails.description")}
                placeholder="Describe your parcel contents..."
                rows={3}
              />
              {errors.parcelDetails?.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.parcelDetails.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="parcelDetails.value">Declared Value (BDT)</Label>
              <Input
                id="parcelDetails.value"
                type="number"
                min="0"
                {...register("parcelDetails.value", { valueAsNumber: true })}
                placeholder="1000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
            <CardDescription>
              Additional delivery preferences and instructions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryInfo.preferredDeliveryDate">
                  Preferred Delivery Date
                </Label>
                <Input
                  id="deliveryInfo.preferredDeliveryDate"
                  type="date"
                  {...register("deliveryInfo.preferredDeliveryDate")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deliveryInfo.deliveryInstructions">
                Delivery Instructions
              </Label>
              <Textarea
                id="deliveryInfo.deliveryInstructions"
                {...register("deliveryInfo.deliveryInstructions")}
                placeholder="Any special delivery instructions..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fee Calculation */}
        {calculatedFees && (
          <Card>
            <CardHeader>
              <CardTitle>Fee Calculation</CardTitle>
              <CardDescription>
                Estimated delivery charges for your parcel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Fee:</span>
                  <span>{formatCurrency(calculatedFees.baseFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight Fee ({watchedWeight}kg):</span>
                  <span>{formatCurrency(calculatedFees.weightFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgency Fee ({watchedUrgency}):</span>
                  <span>{formatCurrency(calculatedFees.urgencyFee)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Fee:</span>
                    <span>{formatCurrency(calculatedFees.totalFee)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setCalculatedFees(null);
            }}
          >
            Reset Form
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Parcel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
