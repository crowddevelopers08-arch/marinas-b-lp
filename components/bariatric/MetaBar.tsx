export default function MetaBar() {
  const items = [["Mode", "In-Clinic"], ["Fee", "Rs.1500", "gold"], ["Speciality", "Bariatric"], ["Slots", "Limited"]];
  return (
    <div className="meta-bar">
      <div className="wrap">
        <div className="meta-grid">
          {items.map(([key, value, tone]) => <div className="meta-item" key={key}><div className="k">{key}</div><div className={`v ${tone ?? ""}`}>{value}</div></div>)}
        </div>
      </div>
    </div>
  );
}
