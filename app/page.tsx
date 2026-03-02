export default function Home() {
  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "360px",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <iframe
          src="/proyectos/slider3d/dist/index.html"
          style={{ width: "100%", height: "200px", border: "none" }}
        />

        <div style={{ padding: "15px" }}>
          <a
            href="/proyectos/slider3d/dist/index.html"
            target="_blank"
            style={{
              textDecoration: "none",
              color: "#0070f3",
              fontWeight: "bold"
            }}
          >
            Ver proyecto completo →
          </a>
        </div>
      </div>
    </div>
  );
}
