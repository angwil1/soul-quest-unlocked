import React, { useEffect, useState } from "react";
import appIcon from "../assets/app-icon-512.png";

const IconPreview: React.FC = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "App Icon Preview - AI Complete Me";
    // Best-effort: update meta description for this view
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content');
    meta?.setAttribute('content', 'Preview the 512x512 AI Complete Me app icon.');
    return () => {
      document.title = prevTitle;
      if (prevDesc && meta) meta.setAttribute('content', prevDesc);
    };
  }, []);

  const [importError, setImportError] = useState(false);
  const [publicError, setPublicError] = useState(false);
  const [importFetch, setImportFetch] = useState<string>("pending");
  const [publicFetch, setPublicFetch] = useState<string>("pending");
  const cacheBust = `?cb=${Date.now()}`;

  useEffect(() => {
    // Test fetch for both sources to surface status visibly
    const importUrl = String(appIcon);
    const publicUrl = `/app-icon-512.png${cacheBust}`;
    console.log("IconPreview - testing URLs", { importUrl, publicUrl });
    fetch(importUrl, { cache: "no-store" })
      .then(r => setImportFetch(r.ok ? `ok (${r.status})` : `error (${r.status})`))
      .catch(e => setImportFetch(`error (${e?.message || "fetch failed"})`));
    fetch(publicUrl, { cache: "no-store" })
      .then(r => setPublicFetch(r.ok ? `ok (${r.status})` : `error (${r.status})`))
      .catch(e => setPublicFetch(`error (${e?.message || "fetch failed"})`));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">App Icon Preview</h1>
        <p className="text-muted-foreground mt-2">Here is the 512×512 icon as served by the app.</p>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="grid gap-8 md:grid-cols-2">
          <article className="rounded-xl bg-card text-card-foreground shadow p-6">
            <h2 className="text-xl font-medium mb-4">Bundled asset import</h2>
            <img
              src={appIcon}
              alt="AI Complete Me app icon 512x512 (imported)"
              width={256}
              height={256}
              loading="eager"
              onError={() => setImportError(true)}
              className="mx-auto rounded-lg shadow"
            />
            <p className="text-xs text-muted-foreground mt-1">Fetch status: <span className="font-mono">{importFetch}</span></p>
            <p className="text-sm text-muted-foreground mt-3 break-all">Path: src/assets/app-icon-512.png — Resolved URL: <span className="font-mono">{String(appIcon)}</span></p>
            {importError && (
              <p className="text-sm text-destructive mt-2">Failed to load imported icon. The source file might be missing or corrupted.</p>
            )}
          </article>

          <article className="rounded-xl bg-card text-card-foreground shadow p-6">
            <h2 className="text-xl font-medium mb-4">Public folder (favicon source)</h2>
            <img
              src={`/app-icon-512.png${cacheBust}`}
              alt="AI Complete Me app icon 512x512 (public)"
              width={256}
              height={256}
              loading="eager"
              onError={() => setPublicError(true)}
              className="mx-auto rounded-lg shadow"
            />
            <p className="text-sm text-muted-foreground mt-3 break-all">
              Path: public/app-icon-512.png —
              <a className="underline hover:opacity-80" href={`/app-icon-512.png${cacheBust}`} target="_blank" rel="noreferrer">open in new tab</a>
            </p>
            {publicError && (
              <p className="text-sm text-destructive mt-2">Failed to load from public/. The file may not exist at public/app-icon-512.png.</p>
            )}
          </article>

          <article className="rounded-xl bg-card text-card-foreground shadow p-6">
            <h2 className="text-xl font-medium mb-4">Raw fallback test (direct HTML img)</h2>
            <img
              src={`/app-icon-512.png${cacheBust}`}
              alt="AI Complete Me app icon 512x512 (raw fallback)"
              width={256}
              height={256}
              loading="eager"
              onError={() => setPublicError(true)}
              className="mx-auto rounded-lg shadow"
            />
            <p className="text-sm text-muted-foreground mt-3 break-all">
              Direct path: <code className="font-mono">/app-icon-512.png</code> —
              <a className="underline hover:opacity-80 ml-1" href={`/app-icon-512.png${cacheBust}`} target="_blank" rel="noreferrer">open raw</a>
            </p>
          </article>
          </section>
        </main>
        <footer className="fixed inset-x-0 bottom-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">Bottom preview (direct): /app-icon-512.png</div>
            <a href={`/app-icon-512.png${cacheBust}`} target="_blank" rel="noreferrer" className="shrink-0">
              <img
                src={`/app-icon-512.png${cacheBust}`}
                alt="AI Complete Me app icon 512x512 (bottom preview)"
                width={64}
                height={64}
                className="rounded-md shadow"
              />
            </a>
          </div>
        </footer>
      </div>
    );
  };
  
  export default IconPreview;
