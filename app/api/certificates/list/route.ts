import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Query all certificates with institution details
    const { data: certificates, error } = await supabase
      .from("certificates")
      .select(
        `
        id,
        cert_id,
        recipient_name,
        course_name,
        issue_date,
        expiry_date,
        grade,
        status,
        sha256_hash,
        hash_payload,
        institutions(id, name, code)
        `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations
    const transformedCertificates = certificates.map((cert: any) => ({
      id: cert.id,
      certId: cert.cert_id,
      recipientName: cert.recipient_name,
      courseName: cert.course_name,
      institutionName: cert.institutions?.name || "Unknown Institution",
      institutionCode: cert.institutions?.code || "N/A",
      issuedAt: cert.issue_date,
      expiryDate: cert.expiry_date,
      grade: cert.grade,
      status: cert.status === "active" ? "ACTIVE" : "REVOKED",
      storedHash: cert.sha256_hash,
      currentHash: cert.sha256_hash, // For now, assume current = stored
    }));

    return NextResponse.json({
      success: true,
      data: transformedCertificates,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error fetching certificates" },
      { status: 500 }
    );
  }
}
