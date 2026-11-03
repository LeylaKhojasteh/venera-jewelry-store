/**
 * Delicate two-dimensional jewellery studies framing the auth card.
 * The shapes are the same vocabulary as the catalogue: a necklace, a hoop
 * earring, a solitaire ring and a short chain. All strokes use currentColor.
 */
export function AuthOrnaments() {
  return (
    <div className="v3-auth-ornaments" aria-hidden="true">
      <svg
        className="v3-auth-ornament is-necklace"
        viewBox="0 0 240 300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 18C42 104 78 158 120 158s78-54 96-140" />
        <path d="M111 158h18l-9 17z" />
        <path d="M120 175c13 18 19 31 0 49-19-18-13-31 0-49Z" />
        <circle cx="120" cy="232" r="3.4" fill="currentColor" stroke="none" />
        <circle cx="120" cy="106" r="27" strokeDasharray="2 6" opacity="0.55" />
        <path d="M44 54c10 7 19 16 26 26M196 54c-10 7-19 16-26 26" opacity="0.5" />
        <path d="M86 184l-7 8M154 184l7 8" opacity="0.55" />
      </svg>

      <svg
        className="v3-auth-ornament is-earring"
        viewBox="0 0 190 240"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M94 24c-30 0-52 25-52 57 0 37 27 67 58 67 22 0 40-14 50-35" />
        <path d="M100 148v17" />
        <circle cx="100" cy="181" r="16" />
        <circle cx="100" cy="181" r="5" fill="currentColor" stroke="none" opacity="0.7" />
        <path d="M28 34L15 21M26 64H7M152 102l14 14M154 78h18" opacity="0.55" />
        <circle cx="160" cy="42" r="2.4" fill="currentColor" stroke="none" opacity="0.6" />
      </svg>

      <svg
        className="v3-auth-ornament is-ring"
        viewBox="0 0 220 230"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="104" cy="126" r="58" />
        <circle cx="104" cy="126" r="47" strokeDasharray="2 7" opacity="0.55" />
        <path d="M104 36l24 25-24 37-24-37z" />
        <path d="M80 61h48M104 36v62" opacity="0.6" />
        <path d="M43 191c22 12 74 12 122 0M156 62l13-13M170 82h14" opacity="0.5" />
        <circle cx="165" cy="108" r="2.5" fill="currentColor" stroke="none" opacity="0.6" />
      </svg>

      <svg
        className="v3-auth-ornament is-chain"
        viewBox="0 0 260 190"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="62" cy="98" rx="38" ry="16" transform="rotate(-28 62 98)" />
        <ellipse cx="112" cy="72" rx="38" ry="16" transform="rotate(-28 112 72)" />
        <ellipse cx="161" cy="98" rx="38" ry="16" transform="rotate(-28 161 98)" />
        <ellipse cx="211" cy="72" rx="38" ry="16" transform="rotate(-28 211 72)" opacity="0.7" />
        <circle cx="62" cy="98" r="3" fill="currentColor" stroke="none" />
        <circle cx="112" cy="72" r="3" fill="currentColor" stroke="none" />
        <circle cx="161" cy="98" r="3" fill="currentColor" stroke="none" />
        <path d="M34 142l-11 11M48 152l-7 8" opacity="0.5" />
      </svg>
    </div>
  );
}
