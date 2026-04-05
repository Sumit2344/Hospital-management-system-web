const baseMedicines = [
  { id: 1, name: "Paracetamol 500", category: "Fever", use: "Reduces fever and mild pain", price: "Rs. 25", stock: "In Stock", company: "MediCare Labs" },
  { id: 2, name: "Ibuprofen 400", category: "Pain Relief", use: "Pain and inflammation support", price: "Rs. 48", stock: "In Stock", company: "HealthNova" },
  { id: 3, name: "Amoxicillin 250", category: "Antibiotic", use: "Bacterial infection treatment", price: "Rs. 92", stock: "Prescription", company: "BioSure" },
  { id: 4, name: "Cetirizine 10", category: "Allergy", use: "Sneezing and allergy relief", price: "Rs. 35", stock: "In Stock", company: "WellSpring" },
  { id: 5, name: "Pantoprazole 40", category: "Acidity", use: "Acid reflux and stomach protection", price: "Rs. 78", stock: "In Stock", company: "GastroLife" },
  { id: 6, name: "Azithromycin 500", category: "Antibiotic", use: "Bacterial infection support", price: "Rs. 110", stock: "Prescription", company: "Zen Pharma" },
  { id: 7, name: "ORS Sachet", category: "Hydration", use: "Restores body fluids and salts", price: "Rs. 20", stock: "In Stock", company: "HydraPlus" },
  { id: 8, name: "Vitamin C 500", category: "Supplement", use: "Daily immunity support", price: "Rs. 85", stock: "In Stock", company: "NutriLeaf" },
  { id: 9, name: "Calcium D3", category: "Supplement", use: "Bone and vitamin D support", price: "Rs. 145", stock: "In Stock", company: "BoneCare" },
  { id: 10, name: "Metformin 500", category: "Diabetes", use: "Blood sugar control support", price: "Rs. 70", stock: "Prescription", company: "GlucoWell" },
  { id: 11, name: "Amlodipine 5", category: "Blood Pressure", use: "Helps manage high blood pressure", price: "Rs. 68", stock: "Prescription", company: "Cardia" },
  { id: 12, name: "Losartan 50", category: "Blood Pressure", use: "Supports blood pressure management", price: "Rs. 95", stock: "Prescription", company: "HeartLine" },
  { id: 13, name: "Montelukast 10", category: "Respiratory", use: "Allergy and asthma support", price: "Rs. 88", stock: "In Stock", company: "BreatheWell" },
  { id: 14, name: "Levocetirizine 5", category: "Allergy", use: "Relief from itching and allergies", price: "Rs. 42", stock: "In Stock", company: "AllerFree" },
  { id: 15, name: "Domperidone 10", category: "Digestive", use: "Nausea and vomiting relief", price: "Rs. 54", stock: "In Stock", company: "Digesto" },
  { id: 16, name: "Ondansetron 4", category: "Digestive", use: "Controls nausea and vomiting", price: "Rs. 76", stock: "Prescription", company: "Reliva" },
  { id: 17, name: "Cough Syrup DX", category: "Cough", use: "Dry cough support", price: "Rs. 65", stock: "In Stock", company: "CureSip" },
  { id: 18, name: "Cough Syrup LS", category: "Cough", use: "Wet cough and mucus relief", price: "Rs. 72", stock: "In Stock", company: "CureSip" },
  { id: 19, name: "Dolo 650", category: "Fever", use: "Fever and body pain support", price: "Rs. 30", stock: "In Stock", company: "MediCare Labs" },
  { id: 20, name: "Zincovit", category: "Supplement", use: "Vitamin and mineral support", price: "Rs. 120", stock: "In Stock", company: "NutriLeaf" },
  { id: 21, name: "Iron Plus", category: "Supplement", use: "Iron deficiency support", price: "Rs. 98", stock: "In Stock", company: "RedCell" },
  { id: 22, name: "B-Complex Forte", category: "Supplement", use: "Nerve and energy support", price: "Rs. 90", stock: "In Stock", company: "NutriLeaf" },
  { id: 23, name: "Loperamide 2", category: "Digestive", use: "Loose motion support", price: "Rs. 36", stock: "In Stock", company: "Digesto" },
  { id: 24, name: "Rabeprazole 20", category: "Acidity", use: "Acidity and ulcer support", price: "Rs. 74", stock: "In Stock", company: "GastroLife" },
  { id: 25, name: "Clotrimazole Cream", category: "Skin", use: "Fungal skin infection care", price: "Rs. 58", stock: "In Stock", company: "DermaGlow" },
  { id: 26, name: "Mupirocin Ointment", category: "Skin", use: "Minor skin infection support", price: "Rs. 95", stock: "Prescription", company: "DermaGlow" },
  { id: 27, name: "Ketoconazole Shampoo", category: "Skin", use: "Dandruff and scalp treatment", price: "Rs. 180", stock: "In Stock", company: "HairSure" },
  { id: 28, name: "Saline Nasal Spray", category: "ENT", use: "Nasal dryness and congestion relief", price: "Rs. 62", stock: "In Stock", company: "BreatheWell" },
  { id: 29, name: "Ear Drop Calm", category: "ENT", use: "Minor ear irritation support", price: "Rs. 84", stock: "In Stock", company: "OttoCare" },
  { id: 30, name: "Eye Drop Fresh", category: "Eye Care", use: "Dry eye relief", price: "Rs. 90", stock: "In Stock", company: "VisionAid" },
  { id: 31, name: "Lubricant Eye Gel", category: "Eye Care", use: "Longer dry eye support", price: "Rs. 115", stock: "In Stock", company: "VisionAid" },
  { id: 32, name: "Albuterol Inhaler", category: "Respiratory", use: "Quick breathing relief", price: "Rs. 220", stock: "Prescription", company: "AirFlow" },
  { id: 33, name: "Budesonide Inhaler", category: "Respiratory", use: "Daily asthma control support", price: "Rs. 260", stock: "Prescription", company: "AirFlow" },
  { id: 34, name: "Diclofenac Gel", category: "Pain Relief", use: "Local muscle and joint pain relief", price: "Rs. 66", stock: "In Stock", company: "MoveFree" },
  { id: 35, name: "Aceclofenac 100", category: "Pain Relief", use: "Joint and muscle pain support", price: "Rs. 82", stock: "Prescription", company: "MoveFree" },
  { id: 36, name: "ORS Orange", category: "Hydration", use: "Electrolyte recovery support", price: "Rs. 22", stock: "In Stock", company: "HydraPlus" },
  { id: 37, name: "Insulin Pen", category: "Diabetes", use: "Insulin support for diabetes care", price: "Rs. 540", stock: "Prescription", company: "GlucoWell" },
  { id: 38, name: "Glucose Meter Strips", category: "Diabetes", use: "Blood glucose testing support", price: "Rs. 420", stock: "In Stock", company: "GlucoWell" },
  { id: 39, name: "Aspirin 75", category: "Cardiac Care", use: "Doctor-advised blood thinning support", price: "Rs. 52", stock: "Prescription", company: "HeartLine" },
  { id: 40, name: "Rosuvastatin 10", category: "Cardiac Care", use: "Cholesterol management support", price: "Rs. 132", stock: "Prescription", company: "Cardia" },
  { id: 41, name: "Probiotic Capsule", category: "Digestive", use: "Gut health and digestion support", price: "Rs. 118", stock: "In Stock", company: "Digesto" },
  { id: 42, name: "Folic Acid 5", category: "Supplement", use: "Folate support and recovery care", price: "Rs. 40", stock: "In Stock", company: "RedCell" },
  { id: 43, name: "Multivitamin Gummies", category: "Supplement", use: "Daily nutrition support", price: "Rs. 210", stock: "In Stock", company: "NutriLeaf" },
  { id: 44, name: "Antacid Liquid", category: "Acidity", use: "Fast acidity relief", price: "Rs. 58", stock: "In Stock", company: "GastroLife" },
  { id: 45, name: "Pain Relief Patch", category: "Pain Relief", use: "Back and neck pain support", price: "Rs. 95", stock: "In Stock", company: "MoveFree" },
  { id: 46, name: "Topical Burn Gel", category: "First Aid", use: "Minor burn cooling support", price: "Rs. 72", stock: "In Stock", company: "SafeCare" },
  { id: 47, name: "Antiseptic Solution", category: "First Aid", use: "Cleaning minor wounds", price: "Rs. 48", stock: "In Stock", company: "SafeCare" },
  { id: 48, name: "Bandage Roll", category: "First Aid", use: "Basic dressing and support", price: "Rs. 35", stock: "In Stock", company: "SafeCare" },
  { id: 49, name: "Digital Thermometer", category: "Health Device", use: "Fast temperature check", price: "Rs. 160", stock: "In Stock", company: "CareTech" },
  { id: 50, name: "Pulse Oximeter", category: "Health Device", use: "Checks oxygen and pulse", price: "Rs. 420", stock: "In Stock", company: "CareTech" },
];

const localStoreZones = [
  "Civil Lines",
  "Model Town",
  "Old Bus Stand",
  "Market Road",
  "Hospital Chowk",
  "Green Avenue",
];

const storageGuides = [
  "Store below 25C and keep away from direct sunlight",
  "Keep in a cool and dry place; do not freeze",
  "Keep sealed after opening and protect from humidity",
  "Store upright and keep away from children",
];

const dosageGuides = [
  "Use only as advised by doctor or pharmacist",
  "Follow label directions and complete the prescribed course",
  "Take after food unless doctor says otherwise",
  "Check prescription for exact dosage and timing",
];

export const medicines = baseMedicines.map((medicine, index) => {
  const manufactureMonth = (index % 9) + 1;
  const expiryMonth = ((index + 11) % 12) + 1;
  const manufactureYear = 2024 + (index % 2);
  const expiryYear = 2027 + (index % 2);

  return {
    ...medicine,
    pack: index % 5 === 0 ? "Bottle Pack" : index % 3 === 0 ? "Tube Pack" : "Tablet Strip",
    quantityLabel: index % 4 === 0 ? "15 units" : index % 3 === 0 ? "30 units" : "10 units",
    manufacturedOn: `${String(manufactureMonth).padStart(2, "0")}/${manufactureYear}`,
    expiresOn: `${String(expiryMonth).padStart(2, "0")}/${expiryYear}`,
    storeZone: localStoreZones[index % localStoreZones.length],
    deliveryTime: `${12 + (index % 5) * 6} mins`,
    storage: storageGuides[index % storageGuides.length],
    dosage: dosageGuides[index % dosageGuides.length],
    availabilityNote:
      medicine.stock === "Prescription"
        ? "Prescription verification needed before dispatch"
        : "Fast pickup and home delivery available today",
  };
});
