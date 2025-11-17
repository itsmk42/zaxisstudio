import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get('pincode');

  if (!pincode) {
    return NextResponse.json(
      { error: 'Pincode is required' },
      { status: 400 }
    );
  }

  // Validate pincode format
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: 'Invalid pincode format. Must be 6 digits.' },
      { status: 400 }
    );
  }

  try {
    // Try using india-pincode-lookup package
    const lookup = require('india-pincode-lookup');
    const result = lookup.search(pincode);

    if (result && result.length > 0) {
      const data = result[0];
      return NextResponse.json({
        success: true,
        city: data.district || data.taluk || '',
        state: data.state || '',
        pincode: pincode,
      });
    } else {
      // Fallback to external API if package doesn't find it
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const apiData = await response.json();

      if (apiData[0].Status === 'Success' && apiData[0].PostOffice && apiData[0].PostOffice.length > 0) {
        const postOffice = apiData[0].PostOffice[0];
        return NextResponse.json({
          success: true,
          city: postOffice.District,
          state: postOffice.State,
          pincode: pincode,
        });
      } else {
        return NextResponse.json(
          { error: 'Pincode not found' },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('Pincode lookup error:', error);
    
    // Fallback to external API
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const apiData = await response.json();

      if (apiData[0].Status === 'Success' && apiData[0].PostOffice && apiData[0].PostOffice.length > 0) {
        const postOffice = apiData[0].PostOffice[0];
        return NextResponse.json({
          success: true,
          city: postOffice.District,
          state: postOffice.State,
          pincode: pincode,
        });
      } else {
        return NextResponse.json(
          { error: 'Pincode not found' },
          { status: 404 }
        );
      }
    } catch (fallbackError) {
      console.error('Fallback API error:', fallbackError);
      return NextResponse.json(
        { error: 'Unable to validate pincode. Please try again.' },
        { status: 500 }
      );
    }
  }
}

