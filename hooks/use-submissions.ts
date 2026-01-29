import { useState, useEffect } from 'react';

export interface Submission {
  id: string;
  pricePerKg: number;
  weight: number;
  livestockType: string; // 'Hog' | 'Cattle' etc
  location: string;
  status: 'pending' | 'verified' | 'rejected';
  date: string;
}

export function useSubmissions() {
  const [data, setData] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSubmissions = async (pageNum: number) => {
    // SIMULATED API CALL - Replace with:
    // const res = await fetch(`/api/v1/users/submissions?page=${pageNum}&limit=10`);

    return new Promise<Submission[]>((resolve) => {
      setTimeout(() => {
        const newItems: Submission[] = Array.from({ length: 5 }).map(
          (_, i) => ({
            id: `${pageNum}-${i}`,
            pricePerKg: 180 + Math.floor(Math.random() * 40),
            weight: 90 + Math.floor(Math.random() * 20),
            livestockType: 'Liveweight Hog',
            location: 'Batangas',
            status: Math.random() > 0.3 ? 'verified' : 'pending',
            date: new Date(
              Date.now() - Math.random() * 1000000000,
            ).toISOString(),
          }),
        );
        resolve(newItems);
      }, 1000);
    });
  };

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      const initialData = await fetchSubmissions(1);
      setData(initialData);
      setIsLoading(false);
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    const moreData = await fetchSubmissions(nextPage);

    if (moreData.length === 0) {
      setHasMore(false);
    } else {
      setData((prev) => [...prev, ...moreData]);
      setPage(nextPage);
    }
  };

  return { data, isLoading, loadMore, hasMore };
}
