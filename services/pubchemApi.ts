// PubChem API Service for SafeChem Portal
// Documentation: https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest

const PUBCHEM_BASE_URL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const PUBCHEM_VIEW_URL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug_view';

export interface PubChemCompound {
  cid: number;
  name: string;
  molecularFormula: string;
  molecularWeight: number;
  iupacName?: string;
  canonicalSmiles?: string;
}

export interface PubChemSafetyData {
  ghsClassification?: {
    pictograms: string[];
    signalWord: string;
    hazardStatements: string[];
    precautionaryStatements: string[];
  };
  hazards?: string[];
  firstAid?: string[];
  fireFighting?: string[];
  handling?: string[];
  storage?: string[];
  disposal?: string[];
  physicalHazards?: string[];
  healthHazards?: string[];
  environmentalHazards?: string[];
}

/**
 * Search for chemicals by name
 */
export async function searchChemicalByName(name: string): Promise<PubChemCompound[]> {
  try {
    const response = await fetch(
      `${PUBCHEM_BASE_URL}/compound/name/${encodeURIComponent(name)}/JSON`
    );
    
    if (!response.ok) {
      throw new Error(`PubChem API error: ${response.status}`);
    }

    const data = await response.json();
    const compounds = data.PC_Compounds || [];

    return compounds.map((compound: any) => ({
      cid: compound.id.id.cid,
      name: name,
      molecularFormula: compound.props.find((p: any) => p.urn.label === 'Molecular Formula')?.value?.sval || '',
      molecularWeight: compound.props.find((p: any) => p.urn.label === 'Molecular Weight')?.value?.fval || 0,
      iupacName: compound.props.find((p: any) => p.urn.label === 'IUPAC Name')?.value?.sval,
      canonicalSmiles: compound.props.find((p: any) => p.urn.label === 'SMILES')?.value?.sval,
    }));
  } catch (error) {
    console.error('Error searching chemical:', error);
    return [];
  }
}

/**
 * Get chemical by CAS number
 */
export async function searchChemicalByCAS(casNumber: string): Promise<PubChemCompound | null> {
  try {
    const response = await fetch(
      `${PUBCHEM_BASE_URL}/compound/name/${encodeURIComponent(casNumber)}/JSON`
    );
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const compound = data.PC_Compounds?.[0];

    if (!compound) return null;

    return {
      cid: compound.id.id.cid,
      name: casNumber,
      molecularFormula: compound.props.find((p: any) => p.urn.label === 'Molecular Formula')?.value?.sval || '',
      molecularWeight: compound.props.find((p: any) => p.urn.label === 'Molecular Weight')?.value?.fval || 0,
      iupacName: compound.props.find((p: any) => p.urn.label === 'IUPAC Name')?.value?.sval,
      canonicalSmiles: compound.props.find((p: any) => p.urn.label === 'SMILES')?.value?.sval,
    };
  } catch (error) {
    console.error('Error searching by CAS:', error);
    return null;
  }
}

/**
 * Get GHS Classification and Safety Data
 */
export async function getChemicalSafetyData(cid: number): Promise<PubChemSafetyData> {
  try {
    const response = await fetch(
      `${PUBCHEM_VIEW_URL}/data/compound/${cid}/JSON/?heading=GHS+Classification,Hazards+Identification,First+Aid+Measures,Fire+Fighting+Measures,Handling+and+Storage,Disposal+Methods`
    );

    if (!response.ok) {
      throw new Error(`PubChem API error: ${response.status}`);
    }

    const data = await response.json();
    const sections = data.Record?.Section || [];

    const safetyData: PubChemSafetyData = {};

    // Parse GHS Classification
    const ghsSection = findSection(sections, 'GHS Classification');
    if (ghsSection) {
      safetyData.ghsClassification = parseGHSClassification(ghsSection);
    }

    // Parse Hazards
    const hazardsSection = findSection(sections, 'Hazards Identification');
    if (hazardsSection) {
      safetyData.hazards = extractTextArray(hazardsSection);
    }

    // Parse First Aid
    const firstAidSection = findSection(sections, 'First Aid Measures');
    if (firstAidSection) {
      safetyData.firstAid = extractTextArray(firstAidSection);
    }

    // Parse Fire Fighting
    const fireSection = findSection(sections, 'Fire Fighting Measures');
    if (fireSection) {
      safetyData.fireFighting = extractTextArray(fireSection);
    }

    // Parse Handling and Storage
    const handlingSection = findSection(sections, 'Handling and Storage');
    if (handlingSection) {
      const texts = extractTextArray(handlingSection);
      safetyData.handling = texts.filter(t => t.toLowerCase().includes('handling'));
      safetyData.storage = texts.filter(t => t.toLowerCase().includes('storage'));
    }

    // Parse Disposal
    const disposalSection = findSection(sections, 'Disposal Methods');
    if (disposalSection) {
      safetyData.disposal = extractTextArray(disposalSection);
    }

    return safetyData;
  } catch (error) {
    console.error('Error fetching safety data:', error);
    return {};
  }
}

/**
 * Get chemical properties (formula, weight, etc.)
 */
export async function getChemicalProperties(cid: number) {
  try {
    const response = await fetch(
      `${PUBCHEM_BASE_URL}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,InChI,InChIKey/JSON`
    );

    if (!response.ok) {
      throw new Error(`PubChem API error: ${response.status}`);
    }

    const data = await response.json();
    return data.PropertyTable?.Properties?.[0] || null;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return null;
  }
}

/**
 * Get 2D chemical structure image URL
 */
export function getChemicalImageURL(cid: number, size: number = 300): string {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=${size}x${size}`;
}

// Helper functions

function findSection(sections: any[], heading: string): any {
  for (const section of sections) {
    if (section.TOCHeading === heading) {
      return section;
    }
    if (section.Section) {
      const found = findSection(section.Section, heading);
      if (found) return found;
    }
  }
  return null;
}

function parseGHSClassification(section: any) {
  const info = section.Information || [];
  const classification: any = {
    pictograms: [],
    signalWord: '',
    hazardStatements: [],
    precautionaryStatements: [],
  };

  for (const item of info) {
    if (item.Name === 'Pictogram(s)') {
      const markup = item.Value?.StringWithMarkup?.[0]?.Markup || [];
      classification.pictograms = markup.map((m: any) => m.Extra);
    } else if (item.Name === 'Signal') {
      classification.signalWord = item.Value?.StringWithMarkup?.[0]?.String || '';
    } else if (item.Name === 'GHS Hazard Statements') {
      const statements = item.Value?.StringWithMarkup || [];
      classification.hazardStatements = statements.map((s: any) => s.String);
    } else if (item.Name === 'Precautionary Statement Codes') {
      const statements = item.Value?.StringWithMarkup || [];
      classification.precautionaryStatements = statements.map((s: any) => s.String);
    }
  }

  return classification;
}

function extractTextArray(section: any): string[] {
  const texts: string[] = [];
  
  if (section.Information) {
    for (const info of section.Information) {
      if (info.Value?.StringWithMarkup) {
        for (const markup of info.Value.StringWithMarkup) {
          if (markup.String) {
            texts.push(markup.String);
          }
        }
      } else if (info.Value?.String) {
        texts.push(info.Value.String);
      }
    }
  }

  if (section.Section) {
    for (const subsection of section.Section) {
      texts.push(...extractTextArray(subsection));
    }
  }

  return texts;
}
