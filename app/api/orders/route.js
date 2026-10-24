import { NextResponse } from 'next/server';
import { Db } from '../../../lib/db';

export async function GET() {
  try {
    const orders = Db.getOrders();
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    const newOrder = Db.createOrder(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Auspicious wedding order placed successfully!',
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
