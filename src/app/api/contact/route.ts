import { NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  numberOfGuests?: string;
  message: string;
  heardAboutUs?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Send an email notification using a service like:
    //    - Resend (https://resend.com)
    //    - SendGrid (https://sendgrid.com)
    //    - Nodemailer with SMTP
    //    - AWS SES
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@andronikiscretanhouse.com',
    //   to: process.env.CONTACT_EMAIL_TO || 'andronikiscretanhouse@gmail.com',
    //   subject: `New Booking Inquiry from ${name}`,
    //   html: `
    //     <h2>New Booking Inquiry</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
    //     <p><strong>Preferred Date:</strong> ${body.preferredDate || 'Not specified'}</p>
    //     <p><strong>Number of Guests:</strong> ${body.numberOfGuests || 'Not specified'}</p>
    //     <p><strong>How they heard about us:</strong> ${body.heardAboutUs || 'Not specified'}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    // For now, we'll log the submission and return success
    console.log("Contact form submission:", {
      name,
      email,
      phone: body.phone,
      preferredDate: body.preferredDate,
      numberOfGuests: body.numberOfGuests,
      message,
      heardAboutUs: body.heardAboutUs,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We will contact you shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
