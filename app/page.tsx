import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("certificates")
    .select("*");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        CertiFi AI — Database Test
      </h1>

      <pre className="bg-white/10 p-4 rounded-xl overflow-auto">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}