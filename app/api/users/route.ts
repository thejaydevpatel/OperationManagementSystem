let users = [
  {id:1,name:"jay"},
  {id:2,name:"dev"}
];

export async function GET() {
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = {id: Date.now(), ...body};
  users.push(newUser);
  return Response.json(newUser, { status: 201});
}

export async function PUT(request: Request) {
  const body = await request.json();
  users = users.map(u => (u.id === body.id ? body : u));
  return Response.json({ message: "update"});
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  users = users.filter(u => u.id !== id);
  return Response.json({ message: "Deleted" });
}
