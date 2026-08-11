import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 240"
    {...props}
  >
    <title>Explore button</title>
    <g className="btn-wrap" style={{ cursor: "pointer" }}>
      <circle
        cx={120}
        cy={120}
        r={100}
        className="btn-bg"
        style={{ fill: "#145652", transition: "fill .15s" }}
      />
      <text
        x={120}
        y={134}
        dominantBaseline="middle"
        textAnchor="middle"
        style={{
          fill: "#fff",
          fontFamily: "Cormorant Garamond,sans-serif",
          fontSize: 40,
          fontWeight: 300,
          letterSpacing: "7px",
          
        }}
      >
        Explore
      </text>
      <g
        style={{
          fill: "none",
          stroke: "rgba(255,255,255,.7)",
          strokeWidth: 5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      >
        <path d="M106 88h28M126 80l8 8-8 8" />
      </g>
    </g>
  </svg>
)

export default SvgComponent