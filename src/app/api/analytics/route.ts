import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA_PROPERTY_ID;

// Formatting the private key to handle line breaks correctly if passed in .env
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
  : undefined;

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

if (process.env.GOOGLE_CLIENT_EMAIL && privateKey) {
  analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

export async function GET() {
  if (!analyticsDataClient || !propertyId) {
    return NextResponse.json(
      { error: 'Google Analytics no está configurado (Faltan variables de entorno).' },
      { status: 500 }
    );
  }

  try {
    // 1. Obtener Usuarios Activos (últimos 30 días)
    const [responseUsers] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'activeUsers', // Total de Usuarios
        },
        {
          name: 'newUsers', // Usuarios Nuevos
        },
        {
          name: 'screenPageViews', // Visitas a páginas
        },
        {
          name: 'userEngagementDuration', // Tiempo total de engagement (en segundos)
        }
      ],
    });

    const rows = responseUsers.rows || [];
    let activeUsers = '0';
    let newUsers = '0';
    let views = '0';
    let engagementDuration = 0;

    if (rows.length > 0 && rows[0].metricValues) {
      activeUsers = rows[0].metricValues[0].value || '0';
      newUsers = rows[0].metricValues[1].value || '0';
      views = rows[0].metricValues[2].value || '0';
      engagementDuration = parseFloat(rows[0].metricValues[3].value || '0');
    }

    // Calcular el tiempo de permanencia promedio por usuario activo
    let avgEngagementMins = 0;
    if (parseInt(activeUsers) > 0) {
      avgEngagementMins = (engagementDuration / parseInt(activeUsers)) / 60;
    }

    return NextResponse.json({
      activeUsers,
      newUsers,
      views,
      avgEngagementMins: avgEngagementMins.toFixed(1),
    });

  } catch (error: any) {
    console.error('Error fetching GA data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
