import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const certId = `CERT-${Date.now()}`;

    const { data, error } = await supabase
      .from("certificates")
      .insert([
        {
          cert_id: certId,
          recipient_name: body.recipient_name,
          course_name: body.course_name,
          issue_date: body.issue_date,
          grade: body.grade,
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