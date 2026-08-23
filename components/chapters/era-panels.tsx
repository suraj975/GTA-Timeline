export function EraPanels() {
  return (
    <>
      <section className="chapter chapter-panel liberty-chapter" id="liberty" data-era="liberty">
        <article className="content-block">
          <div className="eyebrow">October 2001 · Liberty City</div>
          <h2 className="chapter-title">A new dimension</h2>
          <p className="chapter-lede">
            The camera reaches street level. The prototype trades pixels and strict overhead geometry
            for fog, height, weather and a city that appears to continue beyond the frame.
          </p>
          <dl className="fact-grid">
            <div className="fact"><dt>The shift</dt><dd>2D to 3D</dd></div>
            <div className="fact"><dt>New language</dt><dd>Street level</dd></div>
            <div className="fact"><dt>Prototype focus</dt><dd>Depth & camera</dd></div>
          </dl>
        </article>
      </section>
      <section className="chapter chapter-panel vice-chapter" id="vice" data-era="vice">
        <article className="content-block">
          <div className="eyebrow">Next destination · 2002</div>
          <h2 className="chapter-title">Vice is calling</h2>
          <p className="chapter-lede">
            Cold concrete gives way to neon, sunset and ocean air. This is a theme-transition teaser:
            the next milestone will turn the tunnel exit into a complete Vice City chapter.
          </p>
          <dl className="fact-grid">
            <div className="fact"><dt>Palette</dt><dd>Pink · cyan</dd></div>
            <div className="fact"><dt>Transition</dt><dd>Tunnel to coast</dd></div>
            <div className="fact"><dt>Status</dt><dd>Next milestone</dd></div>
          </dl>
        </article>
      </section>
    </>
  );
}
