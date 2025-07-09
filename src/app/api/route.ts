export async function GET(request: Request) {
  const data = await fetch("https://api.vercel.app/blog");
  const posts = await data.text();

  return new Response(posts, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
