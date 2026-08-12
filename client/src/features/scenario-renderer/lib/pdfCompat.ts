/**
 * Runtime APIs that pdfjs-dist 5.x assumes, but SaluteTV / some Android
 * WebViews lack even when the UA claims a modern Chrome.
 */
/** biome-ignore-all lint/style/noNonNullAssertion: some ai shit here */

type MapWithUpsert<K, V> = Map<K, V> & {
  getOrInsert?: (key: K, defaultValue: V) => V;
  getOrInsertComputed?: (key: K, callback: (key: K) => V) => V;
};

type WeakMapWithUpsert<K extends object, V> = WeakMap<K, V> & {
  getOrInsert?: (key: K, defaultValue: V) => V;
  getOrInsertComputed?: (key: K, callback: (key: K) => V) => V;
};

const installMapUpsert = () => {
  const mapProto = Map.prototype as MapWithUpsert<unknown, unknown>;

  if (typeof mapProto.getOrInsert !== 'function') {
    mapProto.getOrInsert = function getOrInsert(key, defaultValue) {
      if (!this.has(key)) {
        this.set(key, defaultValue);
      }
      return this.get(key);
    };
  }

  if (typeof mapProto.getOrInsertComputed !== 'function') {
    mapProto.getOrInsertComputed = function getOrInsertComputed(key, callback) {
      if (!this.has(key)) {
        this.set(key, callback(key));
      }
      return this.get(key);
    };
  }

  const weakProto = WeakMap.prototype as WeakMapWithUpsert<object, unknown>;

  if (typeof weakProto.getOrInsert !== 'function') {
    weakProto.getOrInsert = function getOrInsert(key, defaultValue) {
      if (!this.has(key)) {
        this.set(key, defaultValue);
      }
      return this.get(key);
    };
  }

  if (typeof weakProto.getOrInsertComputed !== 'function') {
    weakProto.getOrInsertComputed = function getOrInsertComputed(
      key,
      callback,
    ) {
      if (!this.has(key)) {
        this.set(key, callback(key));
      }
      return this.get(key);
    };
  }
};

const installUint8ArrayCompat = () => {
  const proto = Uint8Array.prototype as Uint8Array & {
    toHex?: () => string;
    toBase64?: () => string;
  };

  if (typeof proto.toHex !== 'function') {
    proto.toHex = function toHex(this: Uint8Array): string {
      const hex = new Array<string>(this.length);
      for (let i = 0; i < this.length; i++) {
        hex[i] = this[i]!.toString(16).padStart(2, '0');
      }
      return hex.join('');
    };
  }

  if (typeof proto.toBase64 !== 'function') {
    proto.toBase64 = function toBase64(this: Uint8Array): string {
      let binary = '';
      for (let i = 0; i < this.length; i++) {
        binary += String.fromCharCode(this[i]!);
      }
      return btoa(binary);
    };
  }

  const Ctor = Uint8Array as typeof Uint8Array & {
    fromBase64?: (str: string) => Uint8Array;
    fromHex?: (str: string) => Uint8Array;
  };

  if (typeof Ctor.fromBase64 !== 'function') {
    Ctor.fromBase64 = (str: string) => {
      const binary = atob(str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    };
  }

  if (typeof Ctor.fromHex !== 'function') {
    Ctor.fromHex = (str: string) => {
      const cleaned = str.replace(/\s+/g, '');
      const bytes = new Uint8Array(cleaned.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Number.parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
      }
      return bytes;
    };
  }
};

const installMathSumPrecise = () => {
  const math = Math as typeof Math & {
    sumPrecise?: (values: Iterable<number>) => number;
  };
  if (typeof math.sumPrecise === 'function') return;

  // Sufficient for pdf.js; full IEEE precise sum is unnecessary here.
  math.sumPrecise = (values) => {
    let sum = 0;
    for (const value of values) {
      sum += value;
    }
    return sum;
  };
};

export const installPdfRuntimeCompat = () => {
  installUint8ArrayCompat();
  installMapUpsert();
  installMathSumPrecise();
};
