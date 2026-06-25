import { consultationIncludes, whoShouldBook } from "./data";
import { BookButton } from "./Shared";

export default function BookingSection() {
  return (
    <section className="book" id="book">
      <div className="wrap">
        <div className="consult-card consult-card--row">
          <div className="consult-price-col">
            <div className="fee">Rs.1500</div>
            <div className="fee-label">One-time consultation · In-clinic · Limited slots per week</div>
                      <ul className="consult-check">
            {consultationIncludes.map((item) => (
              <li key={item}><span className="tick">✓</span>{item}</li>
            ))}
          </ul>
            <BookButton>Book My Consultation - Rs.1500</BookButton>
          </div>

          <div className="who-col">
            <div className="wt">Who Should Book</div>
            <ul className="who-list">
              {whoShouldBook.map((item) => (
                <li key={item}><span className="tick">✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
