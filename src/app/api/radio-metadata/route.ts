import { NextResponse } from 'next/server';
import { URL } from 'url';
import http from 'http';
import https from 'https';

export const dynamic = 'force-dynamic';

// Función para corregir caracteres UTF-8 corruptos de ISO-8859-1 en streams antiguos
function fixMetadataEncoding(str: string): string {
  try {
    // Si la cadena tiene secuencias UTF-8 rotas leídas como latin1, esto las reparará
    return decodeURIComponent(escape(str));
  } catch (e) {
    // Si falla, limpiar caracteres inválidos comunes de control
    return str.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
  }
}

// Función para consultar la API pública de Laut.fm para estaciones específicas
async function fetchLautFmMetadata(stationName: string): Promise<{ title: string; artist: string; raw: string }> {
  return new Promise((resolve) => {
    const url = `https://api.laut.fm/station/${stationName}/current_song`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const song = JSON.parse(data);
          if (song && song.title) {
            resolve({
              title: song.title.trim(),
              artist: song.artist?.name?.trim() || 'Desconocido',
              raw: `${song.artist?.name} - ${song.title}`
            });
          } else {
            resolve({ title: 'Transmisión En Vivo', artist: 'Laut.fm Radio', raw: '' });
          }
        } catch {
          resolve({ title: 'Transmisión En Vivo', artist: 'Laut.fm Radio', raw: '' });
        }
      });
    }).on('error', () => {
      resolve({ title: 'Transmisión En Vivo', artist: 'Laut.fm Radio', raw: '' });
    });
  });
}

function getStreamResponse(url: string, headers: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const lib = parsedUrl.protocol === 'https:' ? https : http;

    const req = lib.request(
      url,
      {
        method: 'GET',
        headers: {
          ...headers,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 4000,
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(getStreamResponse(res.headers.location, headers));
        } else {
          resolve(res);
        }
      }
    );

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout connecting to stream'));
    });
    req.end();
  });
}

function fetchIcyMetadata(streamUrl: string): Promise<{ title: string; artist: string; raw: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getStreamResponse(streamUrl, { 'Icy-MetaData': '1' });
      const metaint = parseInt(res.headers['icy-metaint'] || '0', 10);
      
      if (!metaint) {
        resolve({ title: 'Transmisión En Vivo', artist: 'Metal Radio', raw: '' });
        res.destroy();
        return;
      }

      let bytesRead = 0;
      let metaDataBuffer = Buffer.alloc(0);
      let isReadingMetadata = false;
      let metaDataLength = 0;

      res.on('data', (chunk: Buffer) => {
        if (isReadingMetadata) {
          metaDataBuffer = Buffer.concat([metaDataBuffer, chunk]);
          if (metaDataBuffer.length >= metaDataLength) {
            const metaString = metaDataBuffer.slice(0, metaDataLength).toString('binary');
            res.destroy();
            
            const match = metaString.match(/StreamTitle='([^']*)'/);
            if (match && match[1]) {
              const cleanMeta = fixMetadataEncoding(match[1]);
              const parts = cleanMeta.split(' - ');
              const artist = parts[0]?.trim() || 'Desconocido';
              const title = parts.slice(1).join(' - ')?.trim() || 'Canción Desconocida';
              resolve({ title, artist, raw: cleanMeta });
            } else {
              resolve({ title: 'Transmisión En Vivo', artist: 'Metal Radio', raw: metaString });
            }
          }
        } else {
          bytesRead += chunk.length;
          if (bytesRead >= metaint) {
            const offset = metaint - (bytesRead - chunk.length);
            if (offset < chunk.length) {
              const lengthByte = chunk[offset];
              metaDataLength = lengthByte * 16;

              if (metaDataLength > 0) {
                isReadingMetadata = true;
                metaDataBuffer = chunk.slice(offset + 1);
                if (metaDataBuffer.length >= metaDataLength) {
                  const metaString = metaDataBuffer.slice(0, metaDataLength).toString('binary');
                  res.destroy();
                  const match = metaString.match(/StreamTitle='([^']*)'/);
                  if (match && match[1]) {
                    const cleanMeta = fixMetadataEncoding(match[1]);
                    const parts = cleanMeta.split(' - ');
                    const artist = parts[0]?.trim() || 'Desconocido';
                    const title = parts.slice(1).join(' - ')?.trim() || 'Canción Desconocida';
                    resolve({ title, artist, raw: cleanMeta });
                  } else {
                    resolve({ title: 'Transmisión En Vivo', artist: 'Metal Radio', raw: metaString });
                  }
                }
              } else {
                bytesRead = chunk.length - (offset + 1);
              }
            }
          }
        }
      });

      res.on('error', (err: any) => reject(err));
      
      setTimeout(() => {
        res.destroy();
        reject(new Error('Timeout reading metadata'));
      }, 7000);

    } catch (err) {
      reject(err);
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const streamUrl = searchParams.get('url');

    if (!streamUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Si es una estación de Laut.fm, consultar directamente su API JSON (100% fiable)
    if (streamUrl.includes('laut.fm')) {
      const parts = streamUrl.split('/');
      const stationName = parts[parts.length - 1] || parts[parts.length - 2];
      if (stationName) {
        const lautMetadata = await fetchLautFmMetadata(stationName);
        return NextResponse.json(lautMetadata);
      }
    }

    const data = await fetchIcyMetadata(streamUrl);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ title: 'Transmisión En Vivo', artist: 'Metal Radio', error: error.message });
  }
}
