import { requireAdmin } from "../../../lib/session";
import { guard } from "../../../lib/request";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
export const runtime = "nodejs";
export async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const rejected = await guard(request, 6 * 1024 * 1024);
  if (rejected) return rejected;
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN)
    return Response.json(
      { error: "Product image storage is not configured." },
      { status: 503 },
    );
  try {
    const reader = request.body.getReader();
    let bytes = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 6 * 1024 * 1024) {
        await reader.cancel();
        return Response.json(
          { error: "Choose an image under 5 MB." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const data = await new Response(Buffer.concat(chunks), {
      headers: { "Content-Type": request.headers.get("content-type") },
    }).formData();
    const file = data.get("photo");
    if (
      !file ||
      typeof file.arrayBuffer !== "function" ||
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      return Response.json(
        { error: "Choose a JPEG, PNG or WebP image under 5 MB." },
        { status: 400 },
      );
    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 25000000 });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format))
      throw new Error("Invalid image");
    const output = await image
      .rotate()
      .resize(1600, 2000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const filename = randomUUID() + ".webp";
    if (process.env.VERCEL) {
      const blob = await put(filename, output, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      });
      return Response.json({ image: blob.url }, { status: 201 });
    }
    const directory = join(process.cwd(), "public", "images", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, filename), output, { flag: "wx" });
    return Response.json({ image: "/media/" + filename }, { status: 201 });
  } catch (error) {
    console.error("Product image processing or storage failed:", error);
    return Response.json(
      {
        error: process.env.VERCEL
          ? "Unable to store this image. Please try again later."
          : "Unable to read this image. Please choose another JPEG, PNG or WebP file.",
      },
      { status: process.env.VERCEL ? 503 : 400 },
    );
  }
}
