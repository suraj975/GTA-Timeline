"use client";

import { useEffect, useRef, useState } from "react";

export function SupportArchive() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <div className="support-callout">
        <div className="support-scanline" aria-hidden="true" />
        <span>INDEPENDENT ARCHIVE / COMMUNITY SUPPORTED</span>
        <h3>Keep the archive running.</h3>
        <p>If you enjoyed the drive, you can help cover hosting and support future chapters of Grand Theft History.</p>
        <button className="support-trigger" type="button" onClick={() => setOpen(true)}>
          <i aria-hidden="true">♡</i><span>Support the archive</span><b aria-hidden="true">→</b>
        </button>
        <small>Support funds this independent project—not Rockstar Games or GTA.</small>
      </div>

      {open && (
        <div className="support-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title" aria-describedby="support-description">
            <div className="support-dialog-grid" aria-hidden="true" />
            <header>
              <span>GTH / SUPPORT TERMINAL</span>
              <button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label="Close support window">Close <b aria-hidden="true">×</b></button>
            </header>
            <div className="support-dialog-copy">
              <p>Community checkpoint / 01</p>
              <h2 id="support-title">Support the<br />archive.</h2>
              <p id="support-description">Help keep this independent archive online and make room for deeper maps, stories and future releases.</p>
            </div>
            <div className="support-options">
              <article>
                <span>01 / CARD</span>
                <i aria-hidden="true">☕</i>
                <h3>Buy me a coffee</h3>
                <p>One-time support through a normal card payment.</p>
                <button type="button" disabled>Link coming soon</button>
              </article>
              <article>
                <span>02 / CRYPTO</span>
                <i aria-hidden="true">◇</i>
                <h3>Digital wallets</h3>
                <p>Optional USDC, SOL or ETH support—never the only route.</p>
                <button type="button" disabled>Wallets coming soon</button>
              </article>
            </div>
            <footer><span>No payments are enabled yet.</span><p>Verified destinations will replace these placeholders after setup.</p></footer>
          </section>
        </div>
      )}
    </>
  );
}
