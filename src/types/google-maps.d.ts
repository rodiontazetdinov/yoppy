declare namespace google.maps {
  export class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  export class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    setCenter(latLng: LatLng): void;
    setZoom(zoom: number): void;
    getCenter(): LatLng;
    getZoom(): number;
  }

  export interface MapOptions {
    center?: LatLng;
    zoom?: number;
    mapTypeId?: string;
    disableDefaultUI?: boolean;
    styles?: any[];
  }

  export class Polyline {
    constructor(opts?: PolylineOptions);
    setMap(map: Map | null): void;
    getPath(): MVCArray<LatLng>;
    setPath(path: LatLng[]): void;
  }

  export interface PolylineOptions {
    path?: LatLng[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    map?: Map;
  }

  export class MVCArray<T> {
    constructor(array?: T[]);
    clear(): void;
    getArray(): T[];
    getAt(i: number): T;
    insertAt(i: number, elem: T): void;
    removeAt(i: number): T;
    setAt(i: number, elem: T): void;
    push(elem: T): number;
    pop(): T;
  }
} 