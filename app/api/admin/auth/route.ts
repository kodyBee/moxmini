import { NextRequest, NextResponse } from "next/server";

// In production, store these in environment variables or a database
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "artist";
// Note: For production, use bcrypt to hash passwords and compare them
// This is a simple implementation for initial deployment

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // For now, use simple comparison since we're transitioning
    // In production, use: const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    const isValid = password === "1z2x3s";

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a simple session token (in production, use JWT or proper session management)
    const token = Buffer.from(
      `${username}:${Date.now()}:${Math.random()}`
    ).toString("base64");

    return NextResponse.json({
      success: true,
      token,
      expiresIn: 24 * 60 * 60 * 1000, // 24 hours
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
