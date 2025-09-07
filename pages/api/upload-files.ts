import type { NextApiRequest, NextApiResponse } from "next"
import formidable, { File } from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

function ensureUploadsDir(): string {
  const dir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const uploadsDir = ensureUploadsDir()

  const form = formidable({ multiples: false, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Failed to parse form" })

    try {
      let videoUrl: string | undefined
      let cvUrl: string | undefined

      const moveFile = (file: File, prefix: string) => {
        const ext = path.extname(file.originalFilename || "") || path.extname(file.filepath)
        const safeName = `${prefix}-${Date.now()}${ext}`
        const dest = path.join(uploadsDir, safeName)
        fs.renameSync(file.filepath, dest)
        return `/uploads/${safeName}`
      }

      if (files.video) {
        const f = Array.isArray(files.video) ? files.video[0] : files.video
        if (f) videoUrl = moveFile(f as File, "video")
      }
      if (files.cv) {
        const f = Array.isArray(files.cv) ? files.cv[0] : files.cv
        if (f) cvUrl = moveFile(f as File, "cv")
      }

      return res.status(200).json({ success: true, videoUrl, cvUrl })
    } catch (e) {
      return res.status(500).json({ error: "Upload failed" })
    }
  })
}



