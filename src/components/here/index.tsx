import H from '@here/maps-api-for-javascript';
import { useEffect, useRef } from 'react';
import Icon from '../../assets/truck.ico';

interface Point {
  lat: number;
  lng: number;
}

interface HereMapProps {
  apikey: string;
  points: Point[];
  center: Point;
}

export function HereMap({ apikey, points, center }: HereMapProps) {
  const mapRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const map = useRef<H.Map>();
  const platform = useRef(new H.service.Platform({ apikey }));
  const ui = useRef({} as H.ui.UI);
  const routeGroup = useRef(new H.map.Group());

  function makeNewMap() {
    const rasterTileService = platform.current.getRasterTileService({
      queryParams: {
        style: 'logistics.day',
        // features: 'vehicle_restrictions:active_and_inactive,pois:disabled',
        size: 512,
      },
    });
    // Creates a new instance of the H.service.rasterTile.Provider class
    // The class provides raster tiles for a given tile layer ID and pixel format
    const rasterTileProvider = new H.service.rasterTile.Provider(
      rasterTileService,
    );
    // Create a new Tile layer with the Raster Tile provider
    const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

    return new H.Map(mapRef.current, rasterTileLayer, {
      pixelRatio: window.devicePixelRatio,
      // center: navigator.geolocation,
      center,
      zoom: 14,
      imprint: {
        locale: 'pt_BR',
        font: 'normal normal 14px Arial,sans-serif',
      },
      layers: [rasterTileLayer],
    });
  }

  useEffect(
    () => {
      // Check if the map object has already been created
      if (!map.current) {
        const newMap = makeNewMap();
        // newMap.addObject(new H.map.Marker(center));
        ui.current = H.ui.UI.createDefault(
          newMap,
          platform.current.createDefaultLayers(),
        );

        ui.current.getControl('mapsettings').setDisabled(true);

        ui.current.getControl('scalebar')?.addClass('scalebar-black');

        // Add panning and zooming behavior to the map
        // eslint-disable-next-line no-new
        new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

        // Set the map object to the reference
        map.current = newMap;
      }
    },
    // Dependencies array
    [apikey],
  );
  // Resize the map whenever the window orientation changes
  useEffect(() => {
    const resizeMap = () => map.current?.getViewPort().resize();
    window.addEventListener('resize', resizeMap);
    return () => window.removeEventListener('resize', resizeMap);
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const lineString = new H.geo.LineString([]);

    if (points.length > 1) {
      routeGroup.current.removeAll();
      const newMarker = new H.map.Marker(points[points.length - 1], {
        icon: new H.map.Icon(Icon, {
          size: { w: 48, h: 48 },
        }),
        data: undefined,
      });
      newMarker.addEventListener('tap', () => {
        console.log('tap');
        addPin(points[points.length - 1]);
      });
      routeGroup.current.addObject(newMarker);

      points.forEach(function (point) {
        lineString.pushPoint(point);
      });

      const polyline = new H.map.Polyline(lineString, {
        style: { lineWidth: 6, strokeColor: '#43b929' },
        data: null,
      });

      routeGroup.current.addObject(polyline);
      map.current?.addObject(routeGroup.current);
    }
  }, [points]);

  function addPin(cord?: Point) {
    const infoBubble = new H.ui.InfoBubble(
      cord || { lat: -23.5505, lng: -46.6333 },
      {
        content: '<p>content</p>',
      },
    );

    // Add the info bubble to the UI
    ui.current.addBubble(infoBubble);
  }

  // Return a div element to hold the map
  return (
    <div>
      <div style={{ width: '100%', height: '500px' }} ref={mapRef} />
      <button onClick={(e) => addPin()}>add pin</button>
    </div>
  );
}

const commonSvgStyle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 48 48"
  >
    <path
      d="M24 0C12.955 0 4 9.075 4 20.075C4 28.35 24 48 24 48S44 28.35 44 20.075C44 9.075 35.045 0 24 0Z"
      // fill="${fill}"
      fill="#43b929"
    />
  </svg>
);
