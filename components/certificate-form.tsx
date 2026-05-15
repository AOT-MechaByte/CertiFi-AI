"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HashDisplay } from "@/components/hash-display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { QrPreview } from "@/components/qr-preview";
import type { Certificate, DraftCertificateInput } from "@/types/certificate";
import { supabase } from "@/lib/supabase";

const initialForm: DraftCertificateInput = {
  recipientName: "Rahul Sharma",
  courseName: "AI & ML Bootcamp",
  institutionName: "MechaByte Academy",    // ← String, not UUID
  institutionCode: "MBA-IND",              // ← String, not UUID
  issueDate: "2026-05-14",
  expiryDate: "",
  grade: "Distinction",
  issuedBy: "Asha Registrar",
  note: "..."
};

// Map institutionCode/institutionName to a seeded institution_id UUID
const institutionMap: Record<string, string> = {
  "MBA-IND": "550e8400-e29b-41d4-a716-446655440001", // MechaByte Academy UUID
  "CCL-IND": "550e8400-e29b-41d4-a716-446655440002", // CertiChain Labs UUID
  // ... other institutions
};

export function CertificateForm() {
  const [form, setForm] = useState(initialForm);
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isValid =
    form.recipientName.trim() &&
    form.courseName.trim() &&
    form.institutionName.trim() &&
    form.issueDate &&
    form.grade.trim() &&
    form.issuedBy.trim();

  function updateField<K extends keyof DraftCertificateInput>(
    key: K,
    value: DraftCertificateInput[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      setFeedback("Fill in the required fields before generating a certificate.");
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      // TODO: Replace this mock fetch with a secured server action or Supabase-backed API route.
      const response = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form) // ← Sends: {recipientName, courseName, institutionName, institutionCode, ...}
      });

      const payload = await response.json();

      if (!response.ok) {
        setFeedback(payload.error ?? "Something went wrong while creating the mock certificate.");
        return;
      }

      setGeneratedCertificate(payload.data as Certificate);
      setFeedback("Mock certificate generated successfully. You can extend this with Supabase next.");
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="mesh-border">
        <CardHeader>
          <CardTitle>Issue a Certificate</CardTitle>
          <CardDescription>
            This form is fully interactive, but the persistence layer is intentionally mocked for
            hackathon speed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="recipientName">Recipient name</Label>
              <Input
                id="recipientName"
                value={form.recipientName}
                onChange={(event) => updateField("recipientName", event.target.value)}
                placeholder="Student full name"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="courseName">Course or program</Label>
              <Input
                id="courseName"
                value={form.courseName}
                onChange={(event) => updateField("courseName", event.target.value)}
                placeholder="Program title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution</Label>
              <Input
                id="institutionName"
                value={form.institutionName}
                onChange={(event) => updateField("institutionName", event.target.value)}
                placeholder="Institution name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institutionCode">Institution code</Label>
              <Input
                id="institutionCode"
                value={form.institutionCode}
                onChange={(event) => updateField("institutionCode", event.target.value)}
                placeholder="MBA-IND"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue date</Label>
              <Input
                id="issueDate"
                type="date"
                value={form.issueDate}
                onChange={(event) => updateField("issueDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={(event) => updateField("expiryDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={form.grade}
                onChange={(event) => updateField("grade", event.target.value)}
                placeholder="A+, Distinction, Merit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuedBy">Issued by</Label>
              <Input
                id="issuedBy"
                value={form.issuedBy}
                onChange={(event) => updateField("issuedBy", event.target.value)}
                placeholder="Registrar or admin name"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">Internal note</Label>
              <Textarea
                id="note"
                value={form.note}
                onChange={(event) => updateField("note", event.target.value)}
                placeholder="Optional internal context for this certificate."
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-3">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Generating..." : "Generate Mock Certificate"}
                {!isPending && <ShieldCheck className="ml-2 h-4 w-4" />}
              </Button>
              {feedback && <p className="text-sm text-slate-400">{feedback}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {isPending && <LoadingSpinner label="Generating hash, QR stub, and blockchain anchor..." />}
        {generatedCertificate ? (
          <>
            <Card className="mesh-border">
              <CardHeader>
                <CardTitle>Generation Snapshot</CardTitle>
                <CardDescription>
                  A realistic response payload your future backend can return.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-slate-500">Certificate ID</p>
                  <p className="mt-1 font-display text-lg text-white">{generatedCertificate.certId}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-slate-500">Blockchain anchor</p>
                  <p className="mt-1 break-all font-mono text-xs text-slate-200">
                    {generatedCertificate.txHash}
                  </p>
                </div>
                <Button asChild className="w-full justify-between">
                  <Link href={`/verify/${generatedCertificate.certId}`}>
                    Open verification result
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <QrPreview value={generatedCertificate.qrValue} />
            <HashDisplay storedHash={generatedCertificate.storedHash} />
          </>
        ) : (
          <Card className="mesh-border">
            <CardHeader>
              <CardTitle>Live Preview Area</CardTitle>
              <CardDescription>
                Generate a certificate to preview its QR route and integrity hash instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="rounded-b-[1.5rem] border-t border-white/5 bg-slate-950/40 py-14 text-center text-slate-500">
              Your first generated certificate will appear here.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export interface DraftCertificateInput {
  recipientName: string;
  courseName: string;
  institutionName: string;      // ← Defined as string
  institutionCode: string;      // ← Defined as string
  issueDate: string;
  expiryDate?: string;
  grade: string;
  issuedBy: string;
  note?: string;
}
