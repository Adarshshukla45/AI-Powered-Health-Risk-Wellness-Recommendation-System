/**
 * products.seed.js
 *
 * VERIFICATION POLICY: every product below was looked up from a real,
 * identifiable source (the official patanjaliayurved.net product page,
 * or a retailer listing that quotes the official product page) at the
 * time this seed file was written. Nothing here is invented — no
 * fabricated ingredients, benefits, or dosages. Each entry carries its
 * sourceUrl so it can be re-verified before use.
 *
 * imageUrl is intentionally left blank for all entries: no verified
 * official product image URL was captured during research, and the
 * project's own rule ("if product information cannot be verified, do
 * not display it") applies to images too — better to omit than guess.
 *
 * This is a small starter catalog (8 products) covering common
 * wellness categories, not an exhaustive Patanjali catalog. Add more
 * only by repeating the same verify-first process.
 */

const products = [
  {
    name: "Divya Ashwagandha Churna",
    category: "Stress & Vitality",
    description:
      "A traditional Ayurvedic herbal powder made from Ashwagandha root, generally described in Ayurveda as an adaptogen used to support the body's response to stress and to support general vitality.",
    ingredients: ["Ashwagandha (Withania somnifera) root powder"],
    intendedUse:
      "Traditionally used in Ayurveda for general wellness support related to stress and vitality. Not a treatment for any diagnosed medical condition.",
    warnings: [
      "To be taken under medical/Ayurvedic-practitioner supervision.",
      "Pregnant or breastfeeding women, and people with existing medical conditions or on medication (especially thyroid or blood-pressure medication), should consult a doctor before use.",
      "This statement has not been evaluated by drug regulatory authorities; this product is not intended to diagnose, treat, cure, or prevent any disease.",
    ],
    ageRestrictions: "Not intended for children without medical supervision.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/churna/divya-ashwagandha-churna/21",
    imageUrl: "",
  },
  {
    name: "Divya Mulethi Churna",
    category: "Throat & Respiratory",
    description:
      "A herbal powder made from Mulethi (licorice root), traditionally used in Ayurveda in connection with throat comfort and digestion.",
    ingredients: ["Mulethi (Glycyrrhiza glabra) root powder"],
    intendedUse:
      "Traditional Ayurvedic use for general throat and digestive wellness. Not a treatment for any diagnosed medical condition.",
    warnings: [
      "To be taken under medical supervision, typically 1–4 g with honey, milk, or ghee, or as directed by a physician.",
      "Read the label carefully before use; do not exceed the recommended dose.",
    ],
    ageRestrictions: "Keep out of reach of children; use under medical supervision.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/churna/divya-mulethi-churna/126",
    imageUrl: "",
  },
  {
    name: "Divya Peya (Herbal Tea)",
    category: "Cold & Immunity",
    description:
      "A blended herbal tea combining a large number of traditional Ayurvedic herbs and spices, described by the manufacturer as being enriched with vitamin C and intended to support recovery from cough and cold.",
    ingredients: [
      "Cardamom", "Cinnamon (dalchini)", "Clove (loung)", "Mace (javitri)",
      "Nutmeg (jayphal)", "Black pepper (kali mirch)", "Rose (gulab)",
      "Fennel (sounf)", "Chitrak", "Chavya", "Pippali (small)",
      "Dry ginger (saunth)", "Mulethi", "Tejpatra", "Gorakhmundi",
      "Bhumi amla", "Punarnava", "Bala", "Brahmi", "Shankhpushpi",
      "Van tulsi", "Arjun", "White vasa", "Banafsha", "Nagarmotha", "Tulsi",
    ],
    intendedUse:
      "Marketed as a herbal tea to help with recovery from cough and cold and general immunity support. Not a treatment for any diagnosed respiratory illness.",
    warnings: ["Read the label before use.", "Not a substitute for medical treatment of persistent respiratory symptoms."],
    ageRestrictions: "General audience product; consult a doctor for use in young children.",
    sourceUrl: "https://www.patanjaliayurved.net/product/natural-food-products/herbal-tea/divya-peya/41",
    imageUrl: "",
  },
  {
    name: "Divya Giloy Kwath",
    category: "Fever & Immunity",
    description:
      "A herbal decoction (kwath) based on Giloy, a herb widely used in Ayurveda in connection with fever recovery and general immunity.",
    ingredients: ["Giloy (Tinospora cordifolia)"],
    intendedUse:
      "Traditional Ayurvedic use for general immunity and post-fever recovery support. Not a treatment for any diagnosed febrile illness — persistent or high fever needs medical evaluation.",
    warnings: [
      "To be taken under medical supervision, as directed by the physician.",
      "Store in a cool, dry place; transfer to an airtight container after opening.",
    ],
    ageRestrictions: "Use under medical supervision, particularly for children.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/kwath/divya-giloy-kwath/45",
    imageUrl: "",
  },
  {
    name: "Divya Brahmi Churna",
    category: "Mental Wellness",
    description:
      "A herbal powder made from Brahmi, a herb traditionally described in Ayurveda as a support for memory and mental clarity.",
    ingredients: ["Brahmi (Bacopa monnieri)"],
    intendedUse:
      "Traditional Ayurvedic use for general cognitive/mental wellness support. Not a treatment for any diagnosed neurological or psychiatric condition.",
    warnings: ["To be taken under medical supervision.", "Read the label before use."],
    ageRestrictions: "Use under medical supervision, particularly for children.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/churna/brahmi-churna/29",
    imageUrl: "",
  },
  {
    name: "Divya Shuddhi Churna",
    category: "Digestive Health",
    description:
      "An Ayurvedic herbal powder traditionally described as being used for indigestion and associated with relief from constipation, flatulence, and loss of appetite.",
    ingredients: ["Composition not fully listed in the verified source — see official product page before use."],
    intendedUse:
      "Traditional Ayurvedic use for general digestive comfort. Not a treatment for any diagnosed gastrointestinal condition.",
    warnings: ["As directed by the physician.", "Best before 24 months from date of manufacture."],
    ageRestrictions: "Use under medical supervision, particularly for children.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/churna/divya-shuddhi-churna/1189",
    imageUrl: "",
  },
  {
    name: "Divya Kanthamrit Chewable Tablet",
    category: "Throat & Respiratory",
    description:
      "A chewable Ayurvedic tablet marketed for throat comfort, formulated with herbs traditionally associated with soothing an irritated throat.",
    ingredients: ["Mulethi", "Sounth (dry ginger)", "Pudina Sat (mint extract)"],
    intendedUse:
      "Marketed to help soften and soothe irritated throat tissue. Not a treatment for a diagnosed throat infection needing antibiotics or other medical care.",
    warnings: ["Typical directed use is 1 tablet up to 4 times a day, or as directed by the physician.", "Best before 1080 days from date of manufacture."],
    ageRestrictions: "General audience; consult a doctor for use in young children.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/vati/divya-kanthamrit-chewable-tablet-40-n/3452",
    imageUrl: "",
  },
  {
    name: "Divya Triphala Churna",
    category: "Digestive Health",
    description:
      "A widely known Ayurvedic herbal powder blend, commonly associated with easing constipation, acidity, and gas as part of routine digestive wellness.",
    ingredients: ["Composition not fully listed in the verified source — see official product page before use."],
    intendedUse:
      "Traditional Ayurvedic use for general digestive wellness. Not a treatment for any diagnosed gastrointestinal condition.",
    warnings: ["As directed by the physician.", "Read the label carefully before use."],
    ageRestrictions: "Use under medical supervision, particularly for children.",
    sourceUrl: "https://www.patanjaliayurved.net/product/ayurvedic-medicine/churna/patanjali-divya-triphala-churna/199",
    imageUrl: "",
  },
];

module.exports = products;
