import React, { useEffect, useState } from 'react';
import { useZxing } from 'react-zxing';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';

interface Props {
  onDetected: (result: string) => void;
}

const BarcodeScanner: React.FC<Props> = ({ onDetected }) => {
  const [lastScanned, setLastScanned] = useState('');

  // Optional: camera test
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => console.log("✅ Camera access granted"))
      .catch((err) => console.error("❌ Camera access error:", err));
  }, []);

  // Barcode-only hints
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.EAN_8,
  ]);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      setLastScanned(text);
      console.log("✅ Scanned result:", text);
      onDetected(text);
    },
    onError(error) {
      console.error("❌ Decode error:", error);
    },
    hints,
  });

  return (
    <div>
      <video ref={ref} style={{ width: '100%', maxWidth: '400px' }} />
      {lastScanned && <p>✅ Last Scanned: <strong>{lastScanned}</strong></p>}
    </div>
  );
};

export default BarcodeScanner;
