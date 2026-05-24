import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServicePhotos = ({ providerId, className = '' }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!providerId) return setLoading(false);
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/servicephoto/provider/${providerId}`, { withCredentials: true });
        const data = Array.isArray(res.data) ? res.data : [];
        setPhotos(data);
      } catch (err) {
        console.error('Failed to load service photos', err?.response?.data || err.message || err);
        setError('Unable to load service photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [providerId]);

  if (loading) return null;
  if (error) return <div className={className}><p className="text-sm text-red-500">{error}</p></div>;
  if (!photos.length) return null;

  const buildUrl = (photo) => {
    // photo.photoUrl is stored as filename in uploads/servicePhotos/ by upload.controller
    // use backend static path /uploads/servicePhotos/<filename>
    if (!photo) return '';
    const filename = photo.photoUrl ;
    return `${import.meta.env.VITE_BACKEND_URL}/uploads/servicePhotos/${filename}`;
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-3">Service Photos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((p) => (
          <button
            key={p._id}
            onClick={() => setPreview(buildUrl(p))}
            className="overflow-hidden rounded-lg border p-0"
            aria-label="Open photo"
          >
            <img
              src={buildUrl(p)}
              alt="service"
              className="w-full h-28 object-cover block"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {preview && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1400}} onClick={() => setPreview(null)}>
          <div style={{maxWidth:'90%', maxHeight:'90%'}}>
            <img src={preview} alt="preview" style={{width:'100%', height:'auto', borderRadius:8}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePhotos;
