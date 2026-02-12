const users = [
  { id: 3, name: "jay" },
  { id: 4, name: "dev" }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {

  console.log("req body",request);
  const { id } = await params;
  const idNum = Number(id);

  const user = users.find(u => u.id === idNum);

  if (!user) {
    return Response.json({ message: "user not found" }, { status: 404 });
  }

  return Response.json(user);
}


