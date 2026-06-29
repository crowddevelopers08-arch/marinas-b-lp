export const symptoms = [
  "BMI above 32.5 with a related health condition",
  "Tried multiple diets and exercise plans without lasting results",
  "Suffering from Type 2 Diabetes, Hypertension, or Sleep Apnea",
  "Knee or joint pain worsening due to excess weight",
  "Feeling tired, breathless, or low on energy despite normal tests",
  "Weight affecting your confidence, relationships, or daily life",
];

export const mistakes = [
  "They keep trying crash diets that fail long-term",
  "They believe surgery is dangerous or a last resort",
  "They delay until complications become severe",
  "They don't explore what modern bariatric options actually offer",
];

export const conditions = [
  {
    title: "Obesity",
    items: [
      "BMI >= 27.9 with comorbidities or BMI >= 37.5",
      "Resistant to diet and lifestyle changes",
      "Associated with diabetes, BP, joint pain",
      "Progressive condition that worsens without treatment",
      "Affects life expectancy and quality of life",
    ],
  },
  {
    title: "Metabolic Syndrome",
    items: [
      "High blood sugar, BP, and cholesterol together",
      "Often linked to excess abdominal fat",
      "Significantly increases heart disease and stroke risk",
      "Can go into remission after bariatric surgery",
      "Requires a metabolic, not just dietary, approach",
    ],
  },
];

export const beforeItems = [
  "Constant fatigue and low energy",
  "Failed diets and regained weight",
  "Worsening diabetes, BP, or joint pain",
  "Avoiding social situations due to weight",
  "No clarity on what options are available",
  "Living with guilt and frustration daily",
];

export const afterItems = [
  "Sustainable weight loss with medical support",
  "Significant improvement in diabetes and BP",
  "More energy, better mobility, improved sleep",
  "Renewed confidence and quality of life",
  "Clear treatment roadmap from a specialist",
  "Long-term results backed by clinical evidence",
];

export const benefits = [
  ["Scope", "Minimally Invasive", "Laparoscopic approach with small incisions and less scarring."],
  ["Fast", "Faster Recovery", "Most patients are back to routine within 2-3 weeks."],
  ["Loss", "Lasting Weight Loss", "Unlike diets, the results are maintained long-term."],
  ["Meds", "Reduces Medications", "Many patients reduce or stop diabetes or BP medication."],
  ["Heart", "Heart Health", "Significant improvement in key metabolic markers."],
  ["Mind", "Mental Wellbeing", "Renewed confidence and better emotional health."],
] as const;

export const textTestimonials = [
  {
    initials: "RK",
    name: "R. Kumar",
    text: "I spent years jumping from one diet to another and always regained the weight. This consultation finally explained why and gave me a real medical plan. The surgery changed my life.",
  },
  {
    initials: "SP",
    name: "S. Priya",
    text: "My sugar levels were out of control for a decade. After my sleeve gastrectomy, my diabetes went into remission and I'm off most of my medication. I only wish I'd done it sooner.",
  },
  {
    initials: "AM",
    name: "A. Mohan",
    text: "I came in for a second opinion, unsure and scared. Everything was explained clearly, my reports were reviewed honestly, and I chose the laparoscopic option with full confidence.",
  },
];

export const consultationIncludes = [
  "Detailed obesity and health assessment",
  "BMI evaluation and comorbidity review",
  "Review of existing reports and investigations",
  "Clear discussion of all surgical options available",
  "Expected weight loss outcomes and timeline",
  "Pre-surgery preparation guidance if required",
];

export const whoShouldBook = [
  "Patients with BMI >= 32.5 and health conditions",
  "Those who have failed multiple diet programmes",
  "Patients with obesity-related diabetes or BP",
  "Individuals seeking a surgical second opinion",
  "People wanting clarity before any treatment decision",
  "Anyone whose weight is affecting quality of life",
];

export const faqs = [
  ["Is bariatric surgery safe?", "Modern laparoscopic bariatric surgery is a well-established, routinely performed procedure with a strong safety record when done by an experienced surgical team. Every patient is thoroughly assessed beforehand to confirm they are a suitable candidate and to minimise risk."],
  ["Will I regain weight after surgery?", "Bariatric surgery produces durable, long-term weight loss for the majority of patients. Sustained results depend on following the recommended nutrition and lifestyle guidance, which is part of the structured post-surgery support you receive."],
  ["Which surgery is right for me - sleeve or bypass?", "The right procedure depends on your BMI, existing health conditions, eating patterns, and goals. During your consultation, each option is explained in detail and a personalised recommendation is made for your specific situation."],
  ["How soon can I return to work after surgery?", "Most patients return to a desk-based routine within 2-3 weeks. Recovery time varies based on the procedure and the nature of your work, and clear guidance is provided for your situation."],
  ["Can bariatric surgery cure my diabetes?", "Many patients with Type 2 Diabetes experience significant improvement, and a number achieve remission after bariatric surgery, often reducing or stopping medication. Your potential outcomes are reviewed individually during the consultation."],
  ["What if I've already been advised surgery elsewhere?", "A second opinion is always welcome. Your existing reports are reviewed objectively, your options are explained honestly, and you leave with the clarity to make a confident, informed decision."],
] as const;
