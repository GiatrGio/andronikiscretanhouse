import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  preferredDates?: string[];
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

    // Format preferred dates for display
    const formatPreferredDates = (dates?: string[]) => {
      if (!dates || dates.length === 0) return 'Not specified';
      return dates.map(date => new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })).join('<br>');
    };

    // Send email notification using Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.CONTACT_EMAIL_TO || 'andronikiscretanhouse@gmail.com',
        replyTo: email,
        subject: `New Booking Inquiry from ${name}`,
        html: `
          <h2>New Booking Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
          <p><strong>Preferred Date(s):</strong><br>${formatPreferredDates(body.preferredDates)}</p>
          <p><strong>Number of Guests:</strong> ${body.numberOfGuests || 'Not specified'}</p>
          <p><strong>How they heard about us:</strong> ${body.heardAboutUs || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Log to console as backup
      console.log("Contact form submission:", {
        name,
        email,
        phone: body.phone,
        preferredDates: body.preferredDates,
        numberOfGuests: body.numberOfGuests,
        message,
        heardAboutUs: body.heardAboutUs,
        timestamp: new Date().toISOString(),
      });
      // Continue anyway - don't fail the request if email fails
    }

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
