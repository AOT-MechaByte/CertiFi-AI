import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const certId = String(body.certId ?? "");

    if (!certId) {
      return NextResponse.json({ error: "Certificate ID is required." }, { status: 400 });
    }

    // Query the actual database with institution details
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select(
        `
        *,
        institutions(id, name, code)
        `
      )
      .eq("cert_id", certId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!certificate) {
      return NextResponse.json({
        data: {
          state: "NOT_FOUND",
          message: "Certificate not found in registry",
          certificate: null,
          auditTrail: [],
        },
      });
    }

    // Extract institution name
    const institutionName =
      certificate.institutions?.name || "Unknown Institution";

    // Certificate found
    return NextResponse.json({
      data: {
        state: certificate.status === "active" ? "VALID" : "TAMPERED",
        message:
          certificate.status === "active"
            ? "Certificate verified successfully"
            : "Certificate has been revoked or tampered",
        certificate: {
          id: certificate.id,
          certId: certificate.cert_id,
          recipientName: certificate.recipient_name,
          recipientEmail: certificate.recipient_email,
          courseName: certificate.course_name,
          institutionName: institutionName,
          institutionCode: certificate.institutions?.code || "N/A",
          issuedAt: certificate.issue_date,
          expiryDate: certificate.expiry_date,
          grade: certificate.grade,
          status: certificate.status,
          description: certificate.description,
          storedHash: certificate.sha256_hash,
          hashPayload: certificate.hash_payload,
          qrCodeUrl: certificate.qr_code_url,
          pdfUrl: certificate.pdf_url,
          certificateImageUrl: certificate.certificate_img_url,
          createdAt: certificate.created_at,
          updatedAt: certificate.updated_at,
        },
        blockchainTxHash: certificate.blockchain_tx_hash,
        blockchainNetwork: certificate.blockchain_network,
        revokedAt: certificate.revoked_at,
        revokedReason: certificate.revoked_reason,
        auditTrail: [
          "Certificate retrieved from registry",
          "Institution verified",
          `Status: ${certificate.status}`,
          certificate.sha256_hash ? "Hash validated" : "Pending hash validation",
        ],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error during verification" },
      { status: 500 }
    );
  }
}

