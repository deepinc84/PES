import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SIDEBOX_SOURCE = 'https://s3.amazonaws.com/static.sidebox.com/D36C87DD-3630-41D0-83F4-D0F89C32B957'
const IDS = [
  '1625419','1625418','1625417','1625416','1625415','1625414','1625413','1625412','1625411','1625410','1625409','1625408','1625406','1611714','1611599','1610806','1610697','1609112','1609097','1606922','1606416','1605111','1604089','1603957','1603795','1602935','1602691','1601738','1600337','1599350','1596596','1596259','1595492','1595107','1595047','1594073','1591939','1591848','1591799','1591225','1590807','1590282','1589729','1589560','1588278','1585035','1584878','1583203','1582047','1581702','1581072','1580207','1580158','1580143','1579887','1578963','1578487','1577982','1574791','1567926','1567894','1567584','1567228','1563988','1562298','1555036','1552376','1552008','1550878','1548043','1544236','1544070','1543659','1543209','1542038','1540920','1540798','1540766','1540675','1540514','1540369','1538951','1538868',
]

export async function GET() {
  const results = await Promise.all(IDS.map(async (id) => {
    try {
      const response = await fetch(`${SIDEBOX_SOURCE}/${id}.jpg`, {
        method: 'HEAD',
        headers: { accept: 'image/jpeg,image/*;q=0.8,*/*;q=0.5' },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      })
      return {
        id,
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      }
    } catch (error) {
      return { id, status: 0, ok: false, error: error?.name || 'fetch-error' }
    }
  }))

  const failures = results.filter((result) => !result.ok)
  return NextResponse.json({
    ok: failures.length === 0,
    total: IDS.length,
    successes: results.length - failures.length,
    failures: failures.length,
    failed: failures,
  }, {
    headers: { 'cache-control': 'private, no-store' },
  })
}
