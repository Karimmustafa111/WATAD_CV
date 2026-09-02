import React, { useState } from 'react';

const CrackDetector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setResultImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/detect/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setResultImage(imageUrl);
      } else {
        console.error('فشل في تحليل الصورة');
      }
    } catch (error) {
      console.error('حدث خطأ في الاتصال بالخادم:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>فحص الشروخ الإنشائية - مشروع وَتَد</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          style={{ marginBottom: '10px' }}
        />
        <br />
        <button 
          type="submit" 
          disabled={!selectedImage || loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'جاري الفحص التحليلي...' : 'افحص الصورة'}
        </button>
      </form>

      {/* عرض النتيجة */}
      {resultImage && (
        <div>
          <h3>النتيجة:</h3>
          <img 
            src={resultImage} 
            alt="نتيجة الفحص" 
            style={{ maxWidth: '100%', border: '2px solid #007bff', borderRadius: '8px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default CrackDetector;