import { NextResponse } from 'next/server';
import { Db } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const department = searchParams.get('department') || searchParams.get('dept');
    const search = searchParams.get('search');

    const products = await Db.getProducts({ category, department, search });
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: 'Product title and price are required' },
        { status: 400 }
      );
    }

    const newProduct = await Db.createProduct(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Handloom product added to catalog successfully',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
