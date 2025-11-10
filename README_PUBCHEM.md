# PubChem API Integration Guide

## 🎯 Overview

SafeChem Portal now integrates with **PubChem**, the world's largest free chemical database (100M+ compounds) maintained by the NIH.

## 📁 Files Created

1. **`services/pubchemApi.ts`** - Core API service
2. **`hooks/usePubChem.ts`** - React hooks for easy integration
3. **`app/pubchem-demo.tsx`** - Demo page showing API usage

## 🚀 Quick Start

### 1. Search for Chemicals

```typescript
import { useChemicalSearch } from '@/hooks/usePubChem';

function MyComponent() {
  const { results, loading, error } = useChemicalSearch('acetone');
  
  return (
    <View>
      {results.map(compound => (
        <Text key={compound.cid}>{compound.name}</Text>
      ))}
    </View>
  );
}
```

### 2. Get Safety Data

```typescript
import { useChemicalSafety } from '@/hooks/usePubChem';

function SafetyInfo({ cid }: { cid: number }) {
  const { safetyData, loading } = useChemicalSafety(cid);
  
  return (
    <View>
      <Text>Signal: {safetyData?.ghsClassification?.signalWord}</Text>
      {safetyData?.ghsClassification?.hazardStatements.map(statement => (
        <Text key={statement}>{statement}</Text>
      ))}
    </View>
  );
}
```

### 3. Display Chemical Structure

```typescript
import { getChemicalImageURL } from '@/services/pubchemApi';

function ChemicalImage({ cid }: { cid: number }) {
  return (
    <Image 
      source={{ uri: getChemicalImageURL(cid, 300) }}
      style={{ width: 300, height: 300 }}
    />
  );
}
```

## 📚 Available Functions

### Service Functions (`services/pubchemApi.ts`)

- `searchChemicalByName(name: string)` - Search by chemical name
- `searchChemicalByCAS(casNumber: string)` - Search by CAS number
- `getChemicalSafetyData(cid: number)` - Get GHS, hazards, first aid, etc.
- `getChemicalProperties(cid: number)` - Get formula, weight, SMILES, etc.
- `getChemicalImageURL(cid: number, size?: number)` - Get 2D structure image URL

### React Hooks (`hooks/usePubChem.ts`)

- `useChemicalSearch(query: string)` - Auto-debounced search hook
- `useChemicalSafety(cid: number | null)` - Safety data hook
- `useChemicalProperties(cid: number | null)` - Properties hook

## 🧪 Test the Integration

1. Navigate to the demo page:
   ```bash
   # In your app, navigate to /pubchem-demo
   ```

2. Try searching for:
   - **Acetone** (common solvent)
   - **Benzene** (aromatic hydrocarbon)
   - **67-64-1** (CAS number for acetone)
   - **Sulfuric Acid** (strong acid)

## 📊 Data Structure

### PubChemCompound
```typescript
{
  cid: number;                 // PubChem Compound ID
  name: string;                // Chemical name
  molecularFormula: string;    // e.g., "C3H6O"
  molecularWeight: number;     // e.g., 58.08
  iupacName?: string;          // IUPAC systematic name
  canonicalSmiles?: string;    // SMILES notation
}
```

### PubChemSafetyData
```typescript
{
  ghsClassification?: {
    pictograms: string[];           // e.g., ["Flammable", "Irritant"]
    signalWord: string;             // "Danger" or "Warning"
    hazardStatements: string[];     // e.g., ["H225: Highly Flammable"]
    precautionaryStatements: string[];
  };
  hazards?: string[];
  firstAid?: string[];
  fireFighting?: string[];
  handling?: string[];
  storage?: string[];
  disposal?: string[];
}
```

## 🔄 Integrating with Existing App

### Update Home Screen to Use Real Data

Replace mock data in `app/(tabs)/index.tsx`:

```typescript
import { useChemicalSearch } from '@/hooks/usePubChem';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading } = useChemicalSearch(searchQuery);
  
  return (
    <ScrollView>
      <LiquidGlassSearch 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {loading && <ActivityIndicator />}
      
      {results.map(chemical => (
        <ChemicalCard 
          key={chemical.cid}
          chemical={chemical}
          onPress={() => router.push(`/chemical/${chemical.cid}`)}
        />
      ))}
    </ScrollView>
  );
}
```

### Update Chemical Detail Page

Fetch real SDS data in `app/chemical/[id].tsx`:

```typescript
import { useChemicalSafety, useChemicalProperties } from '@/hooks/usePubChem';

export default function ChemicalDetail() {
  const { id } = useLocalSearchParams();
  const cid = parseInt(id as string);
  
  const { safetyData, loading: safetyLoading } = useChemicalSafety(cid);
  const { properties, loading: propsLoading } = useChemicalProperties(cid);
  
  // Display real SDS data
  return (
    <ScrollView>
      <Image source={{ uri: getChemicalImageURL(cid) }} />
      
      {safetyData?.ghsClassification && (
        <GHSSection data={safetyData.ghsClassification} />
      )}
      
      {safetyData?.firstAid && (
        <FirstAidSection data={safetyData.firstAid} />
      )}
    </ScrollView>
  );
}
```

## 🌐 API Endpoints Reference

### Search by Name
```
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/JSON
```

### Get Safety Data
```
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/{cid}/JSON/?heading=GHS+Classification
```

### Get Chemical Image
```
GET https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/PNG?image_size=300x300
```

## ⚡ Performance Tips

1. **Debouncing**: The `useChemicalSearch` hook auto-debounces (500ms)
2. **Caching**: Consider using AsyncStorage to cache results
3. **Loading States**: Always show loading indicators
4. **Error Handling**: Handle network errors gracefully

## 🔒 Rate Limits

- **No API key required**
- **No hard rate limits** for reasonable use
- Recommended: Max 5 requests/second
- For high-volume apps, consider caching

## 📖 Additional Resources

- [PubChem REST API Docs](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest)
- [GHS Classification Guide](https://pubchem.ncbi.nlm.nih.gov/ghs/)
- [PubChem Help](https://pubchem.ncbi.nlm.nih.gov/help.html)

## 🎓 Next Steps

1. ✅ Test the demo page (`/pubchem-demo`)
2. ✅ Replace mock data in home screen
3. ✅ Update chemical detail page with real SDS
4. ✅ Add caching for offline support
5. ✅ Implement search history
6. ✅ Add favorite chemicals feature

## 🐛 Troubleshooting

**Chemical not found?**
- Try alternative names (e.g., "ethanol" vs "ethyl alcohol")
- Use CAS number for exact matches
- Check spelling

**Slow loading?**
- Check internet connection
- PubChem servers may be slow (government servers)
- Consider caching frequently accessed chemicals

**No safety data?**
- Some chemicals have limited data
- Try searching on PubChem website to verify data exists

---

**🎉 You now have access to 100M+ chemicals with complete SDS data - completely FREE!**
