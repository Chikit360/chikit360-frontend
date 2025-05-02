import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';
import { VideoIcon } from '../../icons';


interface Props {
  onDetected: (result: string) => void;
}

const ScannerView: React.FC<Props & { setLastScanned: (val: string) => void }> = ({
  onDetected,
  setLastScanned,
}) => {
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
      console.log('✅ Scanned:', text);
      onDetected(text);
      setLastScanned(text);
    },
    onError(error) {
      console.error('❌ Scan error:', error);
    },
    hints,
  });

  return (
    <div className="relative border-4 border-blue-500 animate-pulse rounded-lg overflow-hidden shadow-md">
      <video ref={ref} className="w-full max-w-[220px]" />
      <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white text-xs py-1">
        Scanning<span className="animate-pulse">...</span>
      </div>
    </div>
  );
};

const BarcodeScanner: React.FC<Props> = ({ onDetected }) => {
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('');

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm max-w-xs mx-auto">
      <h2 className="text-sm font-semibold text-center mb-3">Barcode Scanner</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setScanning(true)}
          disabled={scanning}
          className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Start Scanning
        </button>
        <button
          onClick={() => setScanning(false)}
          disabled={!scanning}
          className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
        >
          Stop Scanning
        </button>
      </div>

      {scanning ? (
        <div className="flex justify-center">
          <ScannerView onDetected={onDetected} setLastScanned={setLastScanned} />
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400 italic">
          <VideoIcon className="w-10 h-10 mb-2" />
          <p>Scanner is off</p>
        </div>
      )}

      {lastScanned && (
        <div className="mt-3 text-center text-green-600 text-sm font-medium">
          ✅ Scanned: <span className="font-bold">{lastScanned}</span>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
