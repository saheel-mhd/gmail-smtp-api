export default function DashboardLoading() {
  return (
    <main className="container">
      <section className="panel">
        <div className="skeleton" style={{ height: 28, width: 220 }} />
        <div className="skeleton" style={{ height: 14, width: 320, marginTop: 12 }} />
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="skeleton" style={{ height: 16, width: 160 }} />
        <div className="skeleton" style={{ height: 14, width: "100%", marginTop: 12 }} />
        <div className="skeleton" style={{ height: 14, width: "100%", marginTop: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "92%", marginTop: 8 }} />
      </section>
    </main>
  );
}
