"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const supportUrl = process.env.NEXT_PUBLIC_SUPPORT_URL;

function trackSupportEvent(event: "support_cta_view" | "support_modal_open" | "support_cta_click") {
  window.dispatchEvent(new CustomEvent("gth:analytics", { detail: { event } }));
}

export function SupportArchive() {
  const [open, setOpen] = useState(false);
  const callout = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const viewed = useRef(false);

  const closeMission = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  const openMission = () => {
    trackSupportEvent("support_modal_open");
    setOpen(true);
  };

  useEffect(() => {
    const element = callout.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !viewed.current) {
        viewed.current = true;
        trackSupportEvent("support_cta_view");
      }
    }, { threshold: .45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMission();
        return;
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [closeMission, open]);

  return (
    <>
      <div className="support-callout" ref={callout}>
        <div className="support-route" aria-hidden="true"><i /><i /><i /><span>?</span></div>
        <div className="support-payphone" aria-hidden="true">
          <div className="payphone-sign">OPTIONAL</div>
          <div className="payphone-body"><i /><span /><b>GTH</b><small>01</small></div>
          <div className="payphone-cord" />
        </div>
        <div className="support-callout-copy">
          <span>NEW SIDE MISSION / OPTIONAL</span>
          <h3>Keep the archive<br />on the road.</h3>
          <p>Help cover hosting and give future maps, stories and accessibility work somewhere to live.</p>
          <button ref={trigger} className="support-trigger" type="button" onClick={openMission}>
            <i aria-hidden="true">!</i><span>View mission briefing</span><b aria-hidden="true">→</b>
          </button>
          <small>Voluntary support for this independent fan archive. Never required to explore.</small>
        </div>
      </div>

      {open && (
        <div className="support-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeMission(); }}>
          <section ref={dialog} className="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title" aria-describedby="support-description">
            <div className="support-dialog-map" aria-hidden="true"><i /><i /><i /><i /><span>MISSION</span></div>
            <header>
              <span>MISSION / GTH-SIDE-01</span>
              <button ref={closeButton} type="button" onClick={closeMission} aria-label="Close mission briefing">Return to road <b aria-hidden="true">×</b></button>
            </header>
            <div className="support-dialog-copy">
              <p>Optional / community mission</p>
              <h2 id="support-title">Keep it<br />running.</h2>
              <p id="support-description">A small contribution helps pay for hosting and gives this independent archive room to keep improving.</p>
            </div>
            <div className="mission-briefing">
              <div className="mission-objectives">
                <span>BRIEFING</span>
                <h3>The archive stays free.</h3>
                <p>This is a tip, not a purchase. Every chapter, trailer and interactive stays available whether you support it or not.</p>
                <ul>
                  <li><i>01</i><span><strong>Keep the lights on</strong><small>Hosting, domains and monitoring</small></span></li>
                  <li><i>02</i><span><strong>Build the next chapter</strong><small>New research and original interactions</small></span></li>
                  <li><i>03</i><span><strong>Make the route better</strong><small>Accessibility and mobile performance</small></span></li>
                </ul>
              </div>
              <aside className="mission-reward">
                <span>MISSION REWARD</span>
                <strong>+1</strong>
                <h3>Archive<br />fuel</h3>
                <p>No gated content. Just a longer road for everyone.</p>
                {supportUrl ? (
                  <a href={supportUrl} target="_blank" rel="noreferrer" onClick={() => trackSupportEvent("support_cta_click")}>
                    Start side mission <b aria-hidden="true">↗</b><small>Secure checkout via Buy Me a Coffee</small>
                  </a>
                ) : (
                  <div className="mission-pending"><i aria-hidden="true" /> Support link awaiting deployment setup</div>
                )}
              </aside>
            </div>
            <footer><span>Independent archive / no affiliation</span><p>Support funds this project—not Rockstar Games, Take-Two Interactive or GTA.</p></footer>
          </section>
        </div>
      )}
    </>
  );
}
