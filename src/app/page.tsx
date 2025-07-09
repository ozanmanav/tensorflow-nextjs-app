"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

interface Prediction {
  className: string;
  probability: number;
}

// Lazy loading için TensorFlow modüllerini dynamic import ile yükle
const loadTensorFlow = async () => {
  const [tf, mobilenet] = await Promise.all([
    import("@tensorflow/tfjs"),
    import("@tensorflow-models/mobilenet"),
  ]);
  return { tf, mobilenet };
};

export default function Home() {
  const [model, setModel] = useState<any>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Model yükleme - lazy loading ile
  const initializeModel = useCallback(async () => {
    if (isModelInitialized || isModelLoading) return;

    setIsModelLoading(true);
    try {
      console.log("TensorFlow.js lazy loading başlıyor...");
      const { tf, mobilenet } = await loadTensorFlow();

      console.log("TensorFlow.js hazırlanıyor...");
      await tf.ready();

      console.log("MobileNet modeli yükleniyor...");
      const loadedModel = await mobilenet.load();

      setModel(loadedModel);
      setIsModelInitialized(true);
      console.log("Model başarıyla yüklendi!");
    } catch (error) {
      console.error("Model yüklenirken hata:", error);
    } finally {
      setIsModelLoading(false);
    }
  }, [isModelInitialized, isModelLoading]);

  // Görüntü tahmin etme
  const classifyImage = async () => {
    if (!model || !imageRef.current) return;

    setIsLoading(true);
    try {
      const predictions = await model.classify(imageRef.current);

      setPredictions(predictions.slice(0, 5)); // İlk 5 tahmini göster
    } catch (error) {
      console.error("Tahmin hatası:", error);
    }
    setIsLoading(false);
  };

  // Dosya seçimi
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setPredictions([]);
        // Model henüz yüklenmemişse yükle
        if (!isModelInitialized) {
          initializeModel();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleImage = (url: string) => {
    setImagePreview(url);
    setPredictions([]);
    // Model henüz yüklenmemişse yükle
    if (!isModelInitialized) {
      initializeModel();
    }
  };

  // İlk görüntü yüklendiğinde otomatik analiz
  const handleImageLoad = () => {
    if (model && imageRef.current) {
      classifyImage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🤖 AI Görüntü Tanıma
          </h1>
          <p className="text-lg text-gray-600">
            TensorFlow.js ve MobileNet ile güçlendirilmiş görüntü sınıflandırma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sol Panel - Görüntü Yükleme */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              📸 Görüntü Yükle
            </h2>

            {isModelLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">AI Model yükleniyor...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Bu işlem biraz zaman alabilir
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    📁 Dosya Seç
                  </button>
                  <p className="text-gray-500 mt-2 text-sm">
                    JPG, PNG veya WEBP formatında
                  </p>
                </div>

                {imagePreview && (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={imagePreview}
                        alt="Yüklenen görüntü"
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                        onLoad={handleImageLoad}
                        crossOrigin="anonymous"
                      />
                    </div>

                    <button
                      onClick={classifyImage}
                      disabled={isLoading}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Analiz ediliyor...
                        </div>
                      ) : (
                        "🔍 Tekrar Analiz Et"
                      )}
                    </button>
                  </div>
                )}

                {/* Örnek Resimler */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    🎯 Örnek Resimler:
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        loadSampleImage(
                          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300"
                        )
                      }
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm transition-colors"
                    >
                      🐱 Kedi
                    </button>
                    <button
                      onClick={() =>
                        loadSampleImage(
                          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300"
                        )
                      }
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm transition-colors"
                    >
                      🐕 Köpek
                    </button>
                    <button
                      onClick={() =>
                        loadSampleImage(
                          "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=300"
                        )
                      }
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm transition-colors"
                    >
                      🚗 Araba
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sağ Panel - Sonuçlar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              🎯 AI Tahminleri
            </h2>

            {predictions.length > 0 ? (
              <div className="space-y-3">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800 capitalize">
                        {index === 0 && "🏆"} {prediction.className}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        %{Math.round(prediction.probability * 100)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          index === 0 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${prediction.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    🧠 AI Güven Seviyesi:
                  </h3>
                  <p className="text-sm text-gray-600">
                    En yüksek tahmin:{" "}
                    <strong>
                      %{Math.round(predictions[0]?.probability * 100)}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    MobileNet modeli 1000+ farklı nesne sınıfını tanıyabilir
                  </p>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="text-center py-12">
                {isLoading ? (
                  <div>
                    <div className="animate-pulse bg-gray-200 h-8 rounded mb-4"></div>
                    <div className="animate-pulse bg-gray-200 h-6 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
                  </div>
                ) : isModelLoading ? (
                  <div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Model yükleniyor...</p>
                  </div>
                ) : model ? (
                  <div>
                    <button
                      onClick={classifyImage}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      🔍 Görüntüyü Analiz Et
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Görüntü yüklendi, analiz için tıklayın
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-gray-500 mb-2">
                  Analiz için bir görüntü yükleyin
                </p>
                <p className="text-sm text-gray-400">
                  AI modelimiz ihtiyaç duyulduğunda otomatik yüklenecek!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              ⚡ Teknoloji Stack
            </h3>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <span>🧠 TensorFlow.js</span>
              <span>📱 MobileNet</span>
              <span>⚛️ Next.js</span>
              <span>🎨 Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
