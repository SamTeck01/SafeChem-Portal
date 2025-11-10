export interface Chemical {
  id: string;
  name: string;
  formula: string;
  casNumber: string;
  category: 'Acid' | 'Base' | 'Solvent' | 'Salt' | 'Organic' | 'Inorganic';
  hazardLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  description: string;
  imageUrl?: string;
}

export interface SDS {
  // Section 1: Identification
  productName: string;
  productCode: string;
  manufacturer: string;
  address: string;
  emergencyPhone: string;
  infoPhone: string;
  recommendedUse: string;
  restrictionsOnUse: string;

  // Section 2: Hazard Identification
  classification: string[];
  pictograms: string[];
  signalWord: 'DANGER' | 'WARNING' | 'CAUTION';
  hazardStatements: string[];
  precautionaryStatements: string[];

  // Section 3: Composition
  components: Array<{
    name: string;
    casNumber: string;
    concentration: string;
  }>;

  // Section 4: First Aid
  inhalation: string;
  skinContact: string;
  eyeContact: string;
  ingestion: string;
  mostImportantSymptoms: string;

  // Section 5: Fire Fighting
  suitableExtinguishingMedia: string[];
  unsuitableExtinguishingMedia: string[];
  specificHazards: string[];
  protectiveEquipment: string;

  // Section 6: Accidental Release
  personalPrecautions: string;
  environmentalPrecautions: string;
  cleanupMethods: string;

  // Section 7: Handling and Storage
  handlingPrecautions: string;
  storageConditions: string;
  incompatibilities: string[];

  // Section 8: Exposure Controls
  exposureLimits: string;
  engineeringControls: string;
  personalProtectiveEquipment: {
    respiratory: string;
    hands: string;
    eyes: string;
    skin: string;
  };

  // Section 9: Physical and Chemical Properties
  appearance: string;
  odor: string;
  ph: string;
  meltingPoint: string;
  boilingPoint: string;
  flashPoint: string;
  evaporationRate: string;
  flammability: string;
  explosiveLimits: string;
  vaporPressure: string;
  vaporDensity: string;
  density: string;
  solubility: string;
  partitionCoefficient: string;
  autoIgnitionTemp: string;
  decompositionTemp: string;
  viscosity: string;

  // Section 10: Stability and Reactivity
  reactivity: string;
  chemicalStability: string;
  possibleReactions: string[];
  conditionsToAvoid: string[];
  incompatibleMaterials: string[];
  hazardousDecomposition: string[];

  // Section 11: Toxicological Information
  acuteToxicity: string;
  skinCorrosion: string;
  eyeDamage: string;
  respiratorySensitization: string;
  skinSensitization: string;
  mutagenicity: string;
  carcinogenicity: string;
  reproductiveToxicity: string;
  specificTargetOrgan: string;
  aspirationHazard: string;

  // Section 12: Ecological Information
  ecotoxicity: string;
  persistence: string;
  bioaccumulation: string;
  mobility: string;
  otherAdverseEffects: string;

  // Section 13: Disposal
  wasteDisposal: string;
  containerDisposal: string;

  // Section 14: Transport Information
  unNumber: string;
  shippingName: string;
  hazardClass: string;
  packingGroup: string;
  environmentalHazards: string;
  specialPrecautions: string;

  // Section 15: Regulatory Information
  safetyHealthEnvironmental: string[];

  // Section 16: Other Information
  preparedBy: string;
  preparedDate: string;
  revisionDate: string;
  revisionNumber: string;
  additionalInfo: string;
}

export interface ChemicalWithSDS extends Chemical {
  sds: SDS;
}
