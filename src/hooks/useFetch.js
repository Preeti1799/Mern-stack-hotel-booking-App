import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useCallback to prevent re-creation of fetchData on every render
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]); // Only recreate fetchData when the URL changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Depend on fetchData to avoid re-running unnecessarily

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetch;

