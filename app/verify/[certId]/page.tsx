import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Blocks, FileCheck2, ShieldCheck } from "lucide-react";

import { headers } from "next/headers";
import { AnimatedBackground } from "@/components/animated-background";
import { HashDisplay } from "@/components/hash-display";
import { VerificationBadge } from "@/components/verification-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VERIFICATION_COPY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function VerificationResultPage({
  params
}: {
  params: { certId: string };
}) {
  const host = headers().get("host") ?? "localhost:3000";
  const protocol = headers().get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const url = new URL("/api/certificates/verify", `${protocol}://${host}`);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certId: params.certId }),
    cache: "no-store",
  });

  const payload = await response.json();
  const result = response.ok
    ? payload.data
    : {
        state: "NOT_FOUND",
        message: payload.error ?? "Verification service error",
        certificate: null,
        auditTrail: ["Verification service unavailable"],
      };

  const copy = VERIFICATION_COPY[result?.state ?? "NOT_FOUND"];

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-10 lg:px-8">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-primary">
              Public Verdict
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Verification Result</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              A public-friendly verdict card that makes valid and tampered states obvious in seconds.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link href="/verify">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to verify
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/">Landing page</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card className="mesh-border overflow-hidden">
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
              <CardDescription>{copy.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VerificationBadge state={result.state} large />
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
                <p className="font-display text-lg text-white">{copy.title}</p>
                <p className="mt-2 text-sm text-slate-400">{result.message}</p>
              </div>
              <div className="space-y-3">
                {result.auditTrail.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {result.certificate && (
            <Card className="mesh-border">
              <CardHeader>
                <CardTitle>Blockchain-style anchor</CardTitle>
                <CardDescription>
                  This field is intentionally simulated for the starter, but the UI is production-style.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-3">
                    <Blocks className="h-5 w-5 text-primary" />
                    <p className="text-sm text-slate-400">Transaction anchor</p>
                  </div>
                  <p className="mt-3 break-all font-mono text-xs text-slate-200">
                    {result.blockchainAnchor}
                  </p>
                </div>
                <Button asChild className="w-full justify-between">
                  <Link href="/issue">
                    Issue another certificate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
          <div className="space-y-6">
            {result.certificate ? (
              <>
                <HashDisplay
                  storedHash={result.storedHash ?? result.certificate.storedHash}
                  currentHash={result.currentHash ?? result.certificate.currentHash}
                />
                <Card className="mesh-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-primary">
                        {result.state === "VALID" ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <CardTitle>Certificate details</CardTitle>
                        <CardDescription>
                          Details returned from the seeded registry snapshot.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-slate-500">Recipient</p>
                      <p className="mt-1 text-white">{result.certificate.recipientName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-slate-500">Certificate ID</p>
                      <p className="mt-1 text-white">{result.certificate.certId}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-slate-500">Course</p>
                      <p className="mt-1 text-white">{result.certificate.courseName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-slate-500">Issued on</p>
                      <p className="mt-1 text-white">{formatDate(result.certificate.issuedAt)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-slate-500">Institution</p>
                      <p className="mt-1 text-white">{result.certificate.institutionName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-slate-500">Verification count</p>
                      <p className="mt-1 text-white">{result.certificate.verificationCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="mesh-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>No certificate details available</CardTitle>
                      <CardDescription>
                        The mock registry returned a missing state for this lookup.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/verify">Back to public verification</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
