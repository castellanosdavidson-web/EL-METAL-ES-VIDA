import { NextResponse } from 'next/server';
import { URL } from 'url';
import http from 'http';
import https from 'https';

export const dynamic = 'force-dynamic';

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
        timeout: 5000,
      },
      (res) => {
        // Handle redirects
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
        // No ICY metadata support, return default
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
            // Finished reading metadata block
            const metaString = metaDataBuffer.slice(0, metaDataLength).toString('utf-8');
            res.destroy(); // Close stream immediately
            
            // ICY metadata is formatted like: StreamTitle='Artist - Song';StreamUrl='';
            const match = metaString.match(/StreamTitle='([^']*)'/);
            if (match && match[1]) {
              const parts = match[1].split(' - ');
              const artist = parts[0]?.trim() || 'Desconocido';
              const title = parts.slice(1).join(' - ')?.trim() || 'Canción Desconocida';
              resolve({ title, artist, raw: match[1] });
            } else {
              resolve({ title: 'Transmisión En Vivo', artist: 'Metal Radio', raw: metaString });
            }
          }
        } else {
          bytesRead += chunk.length;
          if (bytesRead >= metaint) {
            // The byte at metaint index is the length indicator: length = byteValue * 16
            const offset = metaint - (bytesRead - chunk.length);
            if (offset < chunk.length) {
              const lengthByte = chunk[offset];
              metaDataLength = lengthByte * 16;

              if (metaDataLength > 0) {
                isReadingMetadata = true;
                metaDataBuffer = chunk.slice(offset + 1);
                if (metaDataBuffer.length >= metaDataLength) {
                  // The rest of the metadata is in this chunk
                  const metaString = metaDataBuffer.slice(0, metaDataLength).toString('utf-8');
                  res.destroy();
                  const match = metaString.match(/StreamTitle='([^']*)'/);
                  if (match && match[1]) {
                    const parts = match[1].split(' - ');
                    const artist = parts[0]?.trim() || 'Desconocido';
                    const title = parts.slice(1).join(' - ')?.trim() || 'Canción Desconocida';
                    resolve({ title, artist, raw: match[1] });
                  } else {
                    resolve({ title: 'Transmisión En Vivo', artist: 'Metal Radio', raw: metaString });
                  }
                }
              } else {
                // Metadata length is 0, reset bytesRead and continue
                bytesRead = chunk.length - (offset + 1);
              }
            }
          }
        }
      });

      res.on('error', (err: any) => reject(err));
      
      // Safety timeout for reading data
      setTimeout(() => {
        res.destroy();
        reject(new Error('Timeout reading metadata'));
      }, 8000);

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

    const data = await fetchIcyMetadata(streamUrl);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching radio metadata:', error);
    return NextResponse.json({ title: 'Transmisión En Vivo', artist: 'Metal Radio', error: error.message });
  }
}
