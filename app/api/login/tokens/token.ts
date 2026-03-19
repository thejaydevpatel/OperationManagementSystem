import { NextRequest } from "next/server";

export interface TokenDetails {
  userId: string;
  tenantId: string;
  empCode: string;
  userIp: string;
  email?: string;
  role?: string;
}

export const retriveTokenDetails = async (
  req: NextRequest
): Promise<TokenDetails | null> => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    // ⚠ Replace with proper JWT verification in production
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    return {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      empCode: decoded.empCode,
      userIp: decoded.userIp,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Token parse error:", error);
    return null;
  }
};