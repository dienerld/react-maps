import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import { useEffect, useRef, useState } from 'react';

export function TomtomMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<tt.Map>({} as tt.Map);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapLat, setMapLat] = useState(51.505);
  const [mapLng, setMapLng] = useState(-0.09);

  function incrementMapZoom() {
    setMapZoom(mapZoom + 1);
  }

  function decrementMapZoom() {
    if (mapZoom > 1) setMapZoom(mapZoom - 1);
  }

  function incrementMap() {
    map.setCenter([mapLat, mapLng]);
    map.setZoom(mapZoom);
  }

  useEffect(() => {
    const map = tt.map({
      key: '7tAbj2dCARYBEN02tO4co5OApnaPQBt1',
      container: 'map',
      center: [mapLat, mapLng],
      zoom: mapZoom,
    });
    setMap(map);
    console.log('sdsd');

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapEl} id="map"></div>
    </>
  );
}
