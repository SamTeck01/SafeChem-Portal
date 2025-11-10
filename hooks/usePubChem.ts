import { useState, useEffect } from 'react';
import {
  searchChemicalByName,
  searchChemicalByCAS,
  getChemicalSafetyData,
  getChemicalProperties,
  PubChemCompound,
  PubChemSafetyData,
} from '@/services/pubchemApi';

/**
 * Hook to search chemicals by name or CAS
 */
export function useChemicalSearch(query: string) {
  const [results, setResults] = useState<PubChemCompound[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchChemicals = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try searching by name first
        let compounds = await searchChemicalByName(query);

        // If no results and looks like CAS number, try CAS search
        if (compounds.length === 0 && /^\d+-\d+-\d+$/.test(query)) {
          const casResult = await searchChemicalByCAS(query);
          if (casResult) {
            compounds = [casResult];
          }
        }

        setResults(compounds);
      } catch (err) {
        setError('Failed to search chemicals');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchChemicals, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
}

/**
 * Hook to get chemical safety data
 */
export function useChemicalSafety(cid: number | null) {
  const [safetyData, setSafetyData] = useState<PubChemSafetyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cid) {
      setSafetyData(null);
      return;
    }

    const fetchSafetyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getChemicalSafetyData(cid);
        setSafetyData(data);
      } catch (err) {
        setError('Failed to fetch safety data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyData();
  }, [cid]);

  return { safetyData, loading, error };
}

/**
 * Hook to get chemical properties
 */
export function useChemicalProperties(cid: number | null) {
  const [properties, setProperties] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cid) {
      setProperties(null);
      return;
    }

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const props = await getChemicalProperties(cid);
        setProperties(props);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [cid]);

  return { properties, loading, error };
}
