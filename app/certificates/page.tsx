"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { DashboardShell } from "@/components/dashboard-shell";
import { VerificationBadge } from "@/components/verification-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type FilterValue = "ALL" | "VALID" | "TAMPERED";
type Certificate = {
  id: string;
  certId: string;
  recipientName: string;
  courseName: string;
  institutionName: string;
  issuedAt: string;
  status: string;
  storedHash: string;
  currentHash: string;
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("ALL");

  // Fetch certificates from API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch("/api/certificates/list");
        const result = await response.json();

        if (result.success && result.data) {
          setCertificates(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filtered = certificates.filter((certificate) => {
    const state =
      certificate.status === "REVOKED"
        ? "TAMPERED"
        : certificate.storedHash === certificate.currentHash
          ? "VALID"
          : "TAMPERED";

    const matchesFilter = filter === "ALL" ? true : state === filter;
    const haystack =
      `${certificate.certId} ${certificate.recipientName} ${certificate.courseName}`.toLowerCase();

    return matchesFilter && haystack.includes(query.toLowerCase());
  });

  return (
    <DashboardShell
      title="Certificates Registry"
      subtitle="Search, filter, and paginate a polished table that already feels like a working admin product."
      action={
        <Button asChild>
          <Link href="/issue">
            New certificate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <Card className="mesh-border">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>All certificates</CardTitle>
            <CardDescription>
              Search and filter seeded records. Pagination below is intentionally mocked for the starter.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                className="pl-10"
                placeholder="Search by ID, name, or course"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as FilterValue)}
              className="h-11 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All states</option>
              <option value="VALID">Valid</option>
              <option value="TAMPERED">Tampered</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">Loading certificates...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">
                {certificates.length === 0
                  ? "No certificates issued yet."
                  : "No certificates match your search filters."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((certificate) => {
                    const state =
                      certificate.status === "REVOKED"
                        ? "TAMPERED"
                        : certificate.storedHash === certificate.currentHash
                          ? "VALID"
                          : "TAMPERED";

                    return (
                      <TableRow key={certificate.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{certificate.recipientName}</p>
                            <p className="text-xs text-slate-500">{certificate.courseName}</p>
                          </div>
                        </TableCell>
                        <TableCell>{certificate.certId}</TableCell>
                        <TableCell>{certificate.institutionName}</TableCell>
                        <TableCell>{formatDate(certificate.issuedAt)}</TableCell>
                        <TableCell>
                          <VerificationBadge state={state} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" asChild>
                            <Link href={`/verify/${certificate.certId}`}>Inspect</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-400 sm:flex-row">
                <p>Showing {filtered.length} of {certificates.length} records</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" disabled>
                    Previous
                  </Button>
                  <Button size="sm">1</Button>
                  <Button variant="secondary" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
