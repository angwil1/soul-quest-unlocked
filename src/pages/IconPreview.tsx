import React, { useEffect } from "react";
import appIcon from "@/assets/app-icon-512.png";

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

  const cacheBust = `?cb=${Date.now()}`;

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
              className="mx-auto rounded-lg shadow"
            />
            <p className="text-sm text-muted-foreground mt-3 break-all">Path: src/assets/app-icon-512.png</p>
          </article>

          <article className="rounded-xl bg-card text-card-foreground shadow p-6">
            <h2 className="text-xl font-medium mb-4">Public folder (favicon source)</h2>
            <img
              src={`/app-icon-512.png${cacheBust}`}
              alt="AI Complete Me app icon 512x512 (public)"
              width={256}
              height={256}
              loading="eager"
              className="mx-auto rounded-lg shadow"
            />
            <p className="text-sm text-muted-foreground mt-3 break-all">Path: public/app-icon-512.png</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default IconPreview;
