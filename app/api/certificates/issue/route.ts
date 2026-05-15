import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.recipientName?.trim()) {
      return NextResponse.json(
        { error: "Recipient name is required" },
        { status: 400 }
      );
    }

    if (!body.institutionName?.trim()) {
      return NextResponse.json(
        { error: "Institution name is required" },
        { status: 400 }
      );
    }

    if (!body.institutionCode?.trim()) {
      return NextResponse.json(
        { error: "Institution code is required" },
        { status: 400 }
      );
    }

    // Step 1: Check if institution exists by code
    let { data: existingInstitution, error: queryError } = await supabase
      .from("institutions")
      .select("id")
      .eq("code", body.institutionCode)
      .maybeSingle();

    let institutionId: string;

    if (existingInstitution) {
      // Institution already exists
      institutionId = existingInstitution.id;
    } else {
      // Step 2: Create new institution if it doesn't exist
      // email is required, so generate from institution name
      const institutionEmail = body.institutionName
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "") + "@institution.local";

      const { data: newInstitution, error: createError } = await supabase
        .from("institutions")
        .insert([
          {
            name: body.institutionName,
            code: body.institutionCode,
            email: institutionEmail,
            status: "active",
            plan_tier: "free",
          },
        ])
        .select("id")
        .single();

      if (createError || !newInstitution) {
        return NextResponse.json(
          { error: `Failed to create institution: ${createError?.message || "Unknown error"}` },
          { status: 500 }
        );
      }

      institutionId = newInstitution.id;
    }

    const certId = `CERT-${Date.now()}`;

    const { data, error } = await supabase
      .from("certificates")
      .insert([
        {
          cert_id: certId,
          recipient_name: body.recipientName,
          course_name: body.courseName,
          issue_date: body.issueDate,
          expiry_date: body.expiryDate || null,
          grade: body.grade,
          description: body.note || null,
          institution_id: institutionId,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: data[0],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}