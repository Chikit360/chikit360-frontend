// useRealTimeScannerData.ts
import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path if needed
import { onValue, ref } from 'firebase/database';

const useRealTimeScannerData = (userId: string) => {
  const [barcode, setBarcode] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return; // Early exit if no userId is provided

    // Reference to the user's barcode field in the database
    const barcodeRef = ref(db, `${userId}/barcode`);

    // Listen for real-time changes
    const unsubscribe = onValue(barcodeRef, (snapshot) => {
      const barcodeData = snapshot.val();
      if (barcodeData) {
        setBarcode(barcodeData);
      }
    });

    // Cleanup listener when component unmounts or userId changes
    return () => {
      unsubscribe();
    };
  }, [userId]);

  return barcode;
};

export default useRealTimeScannerData;
