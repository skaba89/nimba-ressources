import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Le nom est requis" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Une adresse email valide est requise" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Le message est requis" },
        { status: 400 }
      );
    }

    // In production, you would save to a database, send an email, etc.
    // For now, just return success
    return NextResponse.json({
      success: true,
      message:
        body.type === "demo"
          ? `Merci ${name} ! Votre demande de démo a été envoyée avec succès. Nous vous contacterons à ${email} sous 24h.`
          : `Merci ${name} ! Votre message a été envoyé avec succès. Nous vous répondrons à ${email} sous 24h.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
