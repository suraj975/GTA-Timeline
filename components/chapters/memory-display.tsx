export function MemoryDisplay({ era }: { era: "2d" | "3d" }) {
  if (era === "2d") {
    return (
      <figure className="memory-display memory-display--2d">
        <div className="memory-machine">
          <div className="memory-screen">
            <div className="memory-image" />
            <div className="memory-hud"><span>$00024750</span><span>★ ★ ★ ☆ ☆</span></div>
            <div className="memory-message">BONUS MULTIPLIER × 3</div>
            <div className="memory-scanlines" aria-hidden="true" />
          </div>
          <div className="memory-controls"><span>POWER</span><i /><i /><small>INSERT DISC</small></div>
        </div>
        <figcaption><span>THE FEELING / 1997</span><strong>The whole city fit inside one glowing screen.</strong></figcaption>
      </figure>
    );
  }

  return (
    <figure className="memory-display memory-display--3d">
      <div className="memory-console-frame">
        <div className="memory-image" />
        <div className="memory-radio"><span>FLASH FM</span><i>◀</i><b>98.7</b><i>▶</i></div>
        <div className="memory-location">OCEAN BEACH<br /><small>22:47</small></div>
        <div className="memory-loading"><span /></div>
      </div>
      <figcaption><span>THE FEELING / 2002</span><strong>The first night you drove toward the neon.</strong></figcaption>
    </figure>
  );
}
