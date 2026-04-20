import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects } from '@/lib/db/schema';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    const allProjects = await db.select().from(projects);
    return NextResponse.json({ 
      success: true, 
      userCount: allUsers.length,
      projectCount: allProjects.length 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
