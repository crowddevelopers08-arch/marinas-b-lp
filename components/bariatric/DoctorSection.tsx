const DOC_IMG = "https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/dr-preethi-mrinalini_wmgdmk.webp";

export default function DoctorSection() {
  return (
    <section className="doctor">
      <div className="wrap">
        <div className="doc-grid">
          {/* Desktop photo — left column */}
          <div className="doc-photo doc-photo--desktop">
            <img src={DOC_IMG} alt="Dr. Preethi Mrinalini" />
          </div>
          <div>
            <h2 className="doc-name">Dr.Preethi Mrinalini</h2>
            <span className="doc-role">Bariatric &amp; Metabolic Surgeon</span>
            {/* Mobile photo — between role and bio */}
            <div className="doc-photo doc-photo--mobile">
              <img src={DOC_IMG} alt="Dr. Preethi Mrinalini" />
            </div>
            <p className="doc-bio">Over [X] years, Dr.Preethi Mrinalini has helped patients struggling with obesity understand their medical options and achieve lasting results through advanced laparoscopic bariatric procedures with a focus on safety, metabolic outcomes, and long-term patient support.</p>
            <p className="doc-mission">To help every patient make an informed decision before obesity affects their health beyond repair.</p>
            <div className="stats"><div className="stat"><div className="n">300+</div><div className="l">Surgeries</div></div><div className="stat"><div className="n">95%</div><div className="l">Success Rate</div></div><div className="stat"><div className="n">12+</div><div className="l">Years Experience</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
