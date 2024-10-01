import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import dbConnect from "../../../../lib/mongodb/mongodb";
import { AdventureModel } from "../../../../lib/schemas/adventure.schema";
import authOptions from "../../auth/auth-options";

export async function GET(
  req: NextRequest,
  { params }: { params: { adventureId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // Find the adventure by id
  try {
    const adventure = await AdventureModel.findById(params.adventureId);

    if (!adventure) {
      return NextResponse.json(
        { error: `Adventure with id ${params.adventureId} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(adventure, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to get adventure: ${error}` },
      { status: 500 }
    );
  }
}