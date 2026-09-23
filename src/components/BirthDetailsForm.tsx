"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Sparkles, MoonStar, MapPin, Calendar, Clock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  tob: z.string().min(1, { message: "Time of birth is required." }),
  pob: z.string().min(2, { message: "Place of birth is required." }),
});

export default function BirthDetailsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dob: "",
      tob: "",
      pob: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Create query string from form values
    const params = new URLSearchParams({
      name: values.name,
      dob: values.dob,
      tob: values.tob,
      pob: values.pob
    });

    // Navigate to the kundli results page
    router.push(`/kundli?${params.toString()}`);
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-card/40 backdrop-blur-md border-indigo-500/20 shadow-2xl">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-indigo-500/50">
          <MoonStar className="w-6 h-6 text-indigo-300" />
        </div>
        <CardTitle className="text-3xl font-bold font-space text-indigo-100">Awaken Your Stars</CardTitle>
        <CardDescription className="text-indigo-200/70 text-base">
          Enter your exact birth details to generate your perfect Vedic Kundli.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-200">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Enter your full name" className="pl-10 bg-black/20 border-indigo-500/30 text-indigo-100 focus-visible:ring-indigo-500" {...field} />
                      <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-200">Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" className="pl-10 bg-black/20 border-indigo-500/30 text-indigo-100 focus-visible:ring-indigo-500" {...field} />
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-200">Time of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="time" className="pl-10 bg-black/20 border-indigo-500/30 text-indigo-100 focus-visible:ring-indigo-500" {...field} />
                        <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-200">Place of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="City, Country" className="pl-10 bg-black/20 border-indigo-500/30 text-indigo-100 focus-visible:ring-indigo-500" {...field} />
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 h-12 text-lg font-medium mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Aligning Planets...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generate Kundli <Sparkles className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

